import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, openSync, closeSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const avdName = 'PescaLead_Test';
const avdRoot = resolve(project, '.cache/avd');
const avdDir = resolve(avdRoot, `${avdName}.avd`);
const artifacts = resolve(project, 'artifacts/emulator');
const args = process.argv.slice(2);
const action = args.find(a => !a.startsWith('--')) ?? 'start';
const software = args.includes('--software');
const headless = args.includes('--headless');
const port = Number(process.env.PESCALEAD_EMULATOR_PORT ?? 5580);
if (!Number.isInteger(port) || port < 5554 || port > 5682 || port % 2) throw new Error('Use uma porta par entre 5554 e 5682.');
const serial = `emulator-${port}`;
const image = 'system-images/android-35/default/x86_64';
const roots = [process.env.PESCALEAD_TEST_SDK, resolve(project, '.cache/test-sdk'), process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT].filter(Boolean);
const sdk = roots.find(root => existsSync(resolve(root, image, 'system.img')) && existsSync(resolve(root, 'emulator/emulator')));
if (!sdk) throw new Error('SDK de teste incompleto. Consulte docs/emulador.md; é necessário system.img e o executável do emulador.');
const adb = resolve(sdk, 'platform-tools/adb');
const emulator = resolve(sdk, 'emulator/emulator');
mkdirSync(artifacts, { recursive: true });
const pause = ms => new Promise(done => setTimeout(done, ms));

const probeCode = `import os,fcntl,json
try:
 fd=os.open('/dev/kvm',os.O_RDWR|os.O_CLOEXEC)
 try:
  version=fcntl.ioctl(fd,0xAE00,0)
  vm=fcntl.ioctl(fd,0xAE01,0)
  os.close(vm)
  print(json.dumps({'usable':True,'api':version}))
 finally: os.close(fd)
except OSError as e:
 print(json.dumps({'usable':False,'errno':e.errno,'error':e.strerror}))
`;

async function command(executable, commandArgs, timeout = 10000) {
  return (await run(executable, commandArgs, { timeout, maxBuffer: 4 * 1024 * 1024 })).stdout.trim();
}

async function diagnose() {
  const kvm = JSON.parse(await command('python3', ['-c', probeCode]));
  let virtualBox = '';
  try { virtualBox = await command('VBoxManage', ['list', 'runningvms']); } catch { /* Optional provider. */ }
  const result = { sdk, avd: avdName, serial, completeImage: true, kvm, runningVirtualBoxVMs: virtualBox.split('\n').filter(Boolean) };
  writeFileSync(resolve(artifacts, 'diagnostico.json'), JSON.stringify(result, null, 2));
  return result;
}

async function avdOnPort() {
  try { return (await command(adb, ['-s', serial, 'emu', 'avd', 'name'], 5000)).split('\n')[0]?.trim(); }
  catch { return undefined; }
}

function configureProfile() {
  const path = resolve(avdDir, 'config.ini');
  if (!existsSync(path)) throw new Error('AVD PescaLead_Test ausente. Veja o comando de criação em docs/emulador.md.');
  const before = readFileSync(path, 'utf8');
  const backup = resolve(avdDir, 'config.ini.before-emulator-fix');
  if (!existsSync(backup)) writeFileSync(backup, before);
  const values = Object.fromEntries(before.split(/\r?\n/).filter(line => line.includes('=')).map(line => { const i = line.indexOf('='); return [line.slice(0, i).trim(), line.slice(i + 1).trim()]; }));
  Object.assign(values, {
    'avd.id': avdName, 'avd.name': avdName,
    'image.sysdir.1': `${image}/`, 'hw.cpu.ncore': software ? '1' : '4',
    'hw.lcd.width': '720', 'hw.lcd.height': '1280', 'hw.lcd.density': '320',
    'hw.ramSize': '2048', 'vm.heapSize': '256',
    'hw.audioInput': 'no', 'hw.audioOutput': 'no', 'hw.camera.back': 'none', 'hw.camera.front': 'none',
    'hw.gpu.enabled': 'yes', 'hw.gpu.mode': 'swiftshader', 'hw.keyboard': 'yes', 'showDeviceFrame': 'no',
    'firstboot.bootFromDownloadableSnapshot': 'no', 'firstboot.bootFromLocalSnapshot': 'no',
    'fastboot.forceColdBoot': 'yes', 'fastboot.forceFastBoot': 'no',
  });
  writeFileSync(path, Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n') + '\n');
}

async function bootReady() {
  try {
    if (await command(adb, ['-s', serial, 'shell', 'getprop', 'sys.boot_completed'], 8000) !== '1') return false;
    for (const service of ['package', 'activity']) {
      const output = await command(adb, ['-s', serial, 'shell', 'service', 'check', service], 8000);
      if (!output.includes(`Service ${service}: found`)) return false;
    }
    return true;
  } catch { return false; }
}

async function start() {
  const diagnostic = await diagnose();
  if (!software && !diagnostic.kvm.usable) {
    console.error(`KVM não pode criar uma VM: ${diagnostic.kvm.error}.`);
    if (diagnostic.runningVirtualBoxVMs.length) console.error(`VirtualBox em execução: ${diagnostic.runningVirtualBoxVMs.join(', ')}. É necessário salvar/encerrar essas VMs antes de usar KVM. Nenhuma VM foi alterada.`);
    console.error('Use --software somente para tentar emulação lenta explicitamente; não há fallback silencioso.');
    process.exitCode = 2;
    return;
  }
  const existing = await avdOnPort();
  if (existing && existing !== avdName) throw new Error(`A porta ${port} pertence ao AVD ${existing}. Escolha outra porta, sem interrompê-lo.`);
  if (existing) {
    if (!await bootReady()) throw new Error('O AVD do projeto já está inicializando. Aguarde ou use emulator:stop antes de reiniciar.');
    console.log(`Emulador pronto: ${serial}.`);
    return;
  }
  configureProfile();
  const log = resolve(artifacts, 'inicializacao.log');
  const fd = openSync(log, 'a');
  const emulatorArgs = ['-avd', avdName, '-port', String(port), '-accel', software ? 'off' : 'on', '-gpu', 'swiftshader', '-cores', software ? '1' : '4', '-no-audio', '-no-boot-anim', '-no-snapshot', '-camera-back', 'none', '-camera-front', 'none'];
  if (headless) emulatorArgs.push('-no-window');
  const child = spawn(emulator, emulatorArgs, { detached: true, stdio: ['ignore', fd, fd], env: { ...process.env, ANDROID_HOME: sdk, ANDROID_SDK_ROOT: sdk, ANDROID_AVD_HOME: avdRoot } });
  closeSync(fd);
  child.unref();
  let spawnFailure;
  child.on('error', error => { spawnFailure = error; });
  const startedAt = Date.now();
  const timeout = Number(process.env.PESCALEAD_BOOT_TIMEOUT_SECONDS ?? (software ? 900 : 240));
  if (!Number.isFinite(timeout) || timeout < 10 || timeout > 1800) throw new Error('Timeout de boot deve estar entre 10 e 1800 segundos.');
  console.log(`Iniciando ${avdName}, modo ${software ? 'software (lento)' : 'KVM'}, ${serial}. Log: ${log}`);
  let lastProgress = 0;
  while (Date.now() - startedAt < timeout * 1000) {
    if (spawnFailure) throw spawnFailure;
    try { process.kill(child.pid, 0); } catch { throw new Error(`O emulador encerrou antes do boot. Confira ${log}.`); }
    if (await bootReady()) {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      writeFileSync(resolve(artifacts, 'boot.json'), JSON.stringify({ avd: avdName, serial, accelerator: software ? 'software' : 'kvm', ready: true, bootSeconds: seconds, timestamp: new Date().toISOString() }, null, 2));
      console.log(`Android inicializado em ${seconds}s. Serviços package e activity disponíveis. Use npm run emulator:verify para instalar e abrir o APK.`);
      return;
    }
    if (Date.now() - lastProgress > 30000) { console.log('Aguardando boot completo e serviços Android…'); lastProgress = Date.now(); }
    await pause(2000);
  }
  try { await command(adb, ['-s', serial, 'emu', 'kill']); } catch { try { process.kill(-child.pid, 'SIGTERM'); } catch {} }
  throw new Error(`Boot não concluído em ${timeout}s. O emulador iniciado por este comando foi encerrado; consulte o log.`);
}

async function stop() {
  const current = await avdOnPort();
  if (!current) { console.log('Emulador do projeto já está parado.'); return; }
  if (current !== avdName) throw new Error(`A porta pertence a ${current}; nenhuma máquina foi encerrada.`);
  await command(adb, ['-s', serial, 'emu', 'kill']);
  console.log('Emulador PescaLead_Test encerrado.');
}

try {
  if (action === 'doctor') console.log(JSON.stringify(await diagnose(), null, 2));
  else if (action === 'start') await start();
  else if (action === 'stop') await stop();
  else throw new Error('Ação inválida. Use start, doctor ou stop.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
