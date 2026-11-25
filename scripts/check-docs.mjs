import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

const root = process.cwd();
const walk = dir => readdirSync(dir).flatMap(name => {
  const path = resolve(dir, name);
  return statSync(path).isDirectory() ? walk(path) : extname(path).toLowerCase() === '.md' ? [path] : [];
});
const files = [resolve('README.md'), resolve('CONTEXT.MD'), resolve('ESPECIFICACAO_PESCALEAD.md'), ...walk(resolve('docs'))];
const errors = [];
let links = 0;
for (const file of files) {
  for (const match of readFileSync(file, 'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target) || target.startsWith('#')) continue;
    links++;
    const path = resolve(dirname(file), target.split('#')[0]);
    if (!path.startsWith(root) || !existsSync(path)) errors.push(`${file}: ${target}`);
  }
}
const features = readdirSync('docs/features').filter(f => /^F\d{3}-.*\.md$/.test(f));
for (const feature of features) {
  const file = readFileSync(`docs/features/${feature}`, 'utf8');
  for (const heading of ['## Código relacionado', '## Histórico de decisões e alterações', '## Critérios de aceite']) if (!file.includes(heading)) errors.push(`${feature}: ausente ${heading}`);
  for (const match of file.matchAll(/\.\.\/adr\/(\d{4}-[^)]+\.md)/g)) {
    const adr = readFileSync(`docs/adr/${match[1]}`, 'utf8');
    if (!adr.includes(feature)) errors.push(`${feature}: ADR ${match[1]} sem vínculo de volta`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`${files.length} documentos, ${links} links locais e ${features.length} funcionalidades verificados.`);
