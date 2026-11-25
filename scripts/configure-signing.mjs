import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const dir = resolve('.signing');
const credentials = resolve(dir, 'credentials.json');
const store = resolve(dir, 'pescalead.jks');

if (process.argv.includes('--password')) {
  if (!existsSync(credentials)) throw new Error('Execute a preparação de assinatura primeiro.');
  process.stdout.write(JSON.parse(readFileSync(credentials, 'utf8')).password);
} else {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  if (!existsSync(credentials)) writeFileSync(credentials, JSON.stringify({ password: randomBytes(24).toString('hex') }), { mode: 0o600 });
  const { password } = JSON.parse(readFileSync(credentials, 'utf8'));
  if (!existsSync(store)) {
    const result = spawnSync('keytool', ['-genkeypair', '-keystore', store, '-storepass', password, '-keypass', password, '-alias', 'pescalead', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-dname', 'CN=PescaLead Personal, O=PescaLead, C=BR'], { stdio: 'pipe' });
    if (result.status !== 0) throw new Error('Não foi possível gerar a chave de assinatura local. Verifique o JDK/keytool.');
    chmodSync(store, 0o600);
  }
  const path = resolve('android/app/build.gradle');
  let gradle = readFileSync(path, 'utf8');
  if (!gradle.includes('// PescaLead personal signing')) {
    gradle = gradle.replace('signingConfigs {', `signingConfigs {
        // PescaLead personal signing: secrets remain outside source control.
        pescalead {
            storeFile file(System.getenv("PESCALEAD_KEYSTORE_FILE"))
            storePassword System.getenv("PESCALEAD_KEYSTORE_PASSWORD")
            keyAlias "pescalead"
            keyPassword System.getenv("PESCALEAD_KEYSTORE_PASSWORD")
        }`);
  }
  gradle = gradle.replace(/(release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/, '$1signingConfig signingConfigs.pescalead');
  if (!gradle.includes('signingConfig signingConfigs.pescalead')) throw new Error('A configuração Gradle mudou; revise a assinatura antes de compilar.');
  writeFileSync(path, gradle);
  console.log('Assinatura pessoal preparada; credenciais mantidas em .signing.');
}
