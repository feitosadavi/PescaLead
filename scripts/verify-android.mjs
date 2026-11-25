import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sdk = process.env.PESCALEAD_TEST_SDK ?? resolve(project, '.cache/test-sdk');
const adb = resolve(sdk, 'platform-tools/adb');
const serial = `emulator-${process.env.PESCALEAD_EMULATOR_PORT ?? 5580}`;
const pkg = 'com.pescalead.app';
const artifact = resolve(project, 'artifacts/emulator');
const { version } = JSON.parse(readFileSync(resolve(project, 'package.json'), 'utf8'));
const apk = resolve(project, `artifacts/PescaLead-${version}.apk`);
mkdirSync(artifact, { recursive: true });
const pause = ms => new Promise(done => setTimeout(done, ms));
const command = async (args, timeout = 20000) => (await run(adb, ['-s', serial, ...args], { timeout, maxBuffer: 8 * 1024 * 1024 })).stdout.trim();

async function ui() {
  await command(['shell', 'uiautomator', 'dump', '/sdcard/pescalead-test-window.xml'], 30000);
  return command(['shell', 'cat', '/sdcard/pescalead-test-window.xml']);
}

async function screenshot(name) {
  const { stdout } = await run(adb, ['-s', serial, 'exec-out', 'screencap', '-p'], { timeout: 20000, encoding: 'buffer', maxBuffer: 12 * 1024 * 1024 });
  writeFileSync(resolve(artifact, name), stdout);
}

try {
  const name = (await command(['emu', 'avd', 'name'])).split('\n')[0]?.trim();
  if (name !== 'PescaLead_Test') throw new Error(`O dispositivo ${serial} não é o AVD isolado do projeto.`);
  if (await command(['shell', 'getprop', 'sys.boot_completed']) !== '1') throw new Error('Android ainda não concluiu o boot. Execute npm run emulator primeiro.');
  for (const service of ['package', 'activity']) if (!(await command(['shell', 'service', 'check', service])).includes(`Service ${service}: found`)) throw new Error(`Serviço ${service} não está pronto.`);
  if (!existsSync(apk)) throw new Error('Gere o APK com npm run build:apk.');
  console.log('Instalando APK no emulador isolado…');
  const install = await command(['install', '-r', apk], 180000);
  writeFileSync(resolve(artifact, 'instalacao.txt'), install);
  if (!install.includes('Success')) throw new Error('A instalação não confirmou Success.');
  await command(['shell', 'input', 'keyevent', 'KEYCODE_WAKEUP']);
  await command(['shell', 'wm', 'dismiss-keyguard']);
  const launch = await command(['shell', 'am', 'start', '-W', '-n', `${pkg}/.MainActivity`], 60000);
  writeFileSync(resolve(artifact, 'abertura.txt'), launch);
  if (/Error:|Exception/.test(launch)) throw new Error('O Android informou falha ao abrir a Activity.');
  let xml = '';
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    xml = await ui();
    if (xml.includes('Onde vamos pescar?')) break;
    await pause(2000);
  }
  writeFileSync(resolve(artifact, 'tela-inicial.xml'), xml);
  await screenshot('pescalead-android.png');
  if (!xml.includes('Onde vamos pescar?')) throw new Error('A Activity abriu, mas a tela React Native não foi confirmada. Consulte screenshot e XML.');
  const verified = ['Sonar'];
  for (const [tab, expected] of [['Carteira', 'Sua carteira'], ['Ajustes', 'Ajuste sua pescaria'], ['Sonar', 'Onde vamos pescar?']]) {
    const node = xml.match(new RegExp(`<node[^>]*content-desc="${tab}"[^>]*>`))?.[0];
    const bounds = node?.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
    if (!bounds) throw new Error(`Aba ${tab} não encontrada com limites acessíveis.`);
    await command(['shell', 'input', 'tap', String(Math.round((+bounds[1] + +bounds[3]) / 2)), String(Math.round((+bounds[2] + +bounds[4]) / 2))]);
    await pause(1200);
    xml = await ui();
    if (!xml.includes(expected)) throw new Error(`A navegação para ${tab} não foi confirmada.`);
    verified.push(tab);
  }
  await screenshot('pescalead-android.png');
  const report = { success: true, timestamp: new Date().toISOString(), serial, apkSha256: createHash('sha256').update(readFileSync(apk)).digest('hex'), installed: true, activityOpened: true, reactNativeRendered: true, tabsVerified: [...new Set(verified)] };
  writeFileSync(resolve(artifact, 'validacao-nativa.json'), JSON.stringify(report, null, 2));
  console.log('APK instalado; React Native renderizado; navegação Sonar/Carteira/Ajustes verificada.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
