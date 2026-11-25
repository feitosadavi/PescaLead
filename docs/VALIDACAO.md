# Validação do PescaLead

Registro da implementação iniciada em 2026-11-17, com resultados finais abaixo. Código, testes controlados, serviços reais e execução nativa são avaliados separadamente.

## Resultado

| Verificação | Evidência | Resultado |
| --- | --- | --- |
| TypeScript | npm run typecheck | Passou. |
| Regras e integrações | npm test | 43 testes passaram em 3 arquivos. |
| Persistência | [storage.test.ts](../tests/storage.test.ts) | Fila de gravação, falha de escrita e preservação de dados inválidos verificadas. |
| Interface | [flows.spec.ts](../e2e/flows.spec.ts) | 4 fluxos passaram: busca/carteira/notas/cobrança/PDF; erro de cota; configuração de IA controlada; amostra parcial explícita. |
| Build web | npm run export:web | Bundle gerado; prévia visual conferida. |
| PDF comercial | Teste de interface e HTML | Valores revisados preservados e nota privada excluída; PDF de teste gerado. |
| Photon real | scripts/smoke-providers.mjs | Endereço público na Avenida Paulista resolvido para coordenadas. |
| Overpass real, consulta pequena | scripts/smoke-providers.mjs | 20 estabelecimentos reais com coordenadas retornados. |
| Motor real | [providers.test.ts](../integration-live/providers.test.ts) | Teste passou, em 56 s: seleção não vazia de até 3 leads reais com coordenadas e evidências dentro do raio solicitado. A recuperação parcial prevista pode ocorrer; o teste não comprova cobertura completa dos 10 km. |
| Documentação | npm run check:docs | Links locais e vínculos entre funcionalidades e ADRs verificados. |
| Lockfile | npm ci --dry-run --ignore-scripts --offline | Resolução do lockfile verificada sem reinstalar pacotes. |
| APK | npm run build:apk | BUILD SUCCESSFUL; variante release com JavaScript incorporado, arm64-v8a e x86_64. |
| Assinatura | apksigner verify --print-certs | Verificada; certificado pessoal CN=PescaLead Personal, O=PescaLead, C=BR. |
| Manifesto | aapt dump badging | com.pescalead.app, versão 1.0.1 (2), Android mínimo API 24 e alvo API 36. |
| Instalar e abrir em Android | Emulador isolado API 35; `artifacts/emulator/validacao-nativa.json` | Passou em 2026-11-25: APK 1.0.1 instalado, Activity aberta, React Native renderizado, abas Sonar/Carteira/Ajustes verificadas. |

## Pacote gerado

- Caminho local: `artifacts/PescaLead-1.0.1.apk`.
- Tamanho: 37,989,536 bytes (36.2 MiB).
- SHA-256: `34aa961dfabf00f22e4016b37e517c69cb4a85d252ab0d42cb6c29764d2dbc27`.
- Manifesto sem permissões de microfone, sobreposição, armazenamento externo amplo, biometria ou vibração. Mantém internet, localização solicitada e receiver interno do Android.
- Certificado/credenciais de assinatura ficam em `.signing/`, com exclusão do Git e permissões restritas. Preservar para atualizações.

## Limitações verificadas

A consulta ampla ao Overpass apresentou timeout/HTTP 502 em região densa; a consulta pequena retornou dados reais. O aplicativo faz somente uma tentativa leve adicional em amostra central de 1 km para erros elegíveis e declara essa cobertura efetiva. Não repete HTTP 429 ou troca automaticamente de servidor. O teste real posterior do motor passou; isso não elimina a dependência de disponibilidade nem demonstra busca exaustiva. Ver [ADR-0010](adr/0010-consulta-espacial-e-cobertura-parcial.md).

Nenhuma chave Gemini real foi fornecida. O fluxo de habilitação, geração estruturada e privacidade foi testado com respostas controladas; não foi realizada inferência real. Configure sua chave e modelo em Ajustes. O app não consegue confirmar se o projeto da chave utiliza plano gratuito.

Ainda é necessário validar em aparelho Android: GPS/permissões, retomada da carteira, SecureStore, abertura de Maps e WhatsApp, PDF e compartilhamento nativos, seletor de backup e download de foto licenciada. A instalação, a abertura e a navegação básica passaram no emulador; isso não comprova os fluxos que dependem do aparelho pessoal do usuário.

Fotos dependem de referência Commons e licença compatível; avaliações do Google não estão disponíveis na fonte inicial. O ranking é heurístico e deve ser calibrado com resultados reais de vendas.

## Auditoria de dependências

As dependências diretas Zod e Vitest foram atualizadas para versões corrigidas (4.6.7 e 5.1.0). O projeto mantém React Native 0.81.5 compatível com Expo SDK 54, com versão única forçada no grafo. Node 22.21.1 ou superior é exigido pelas ferramentas atuais.

A auditoria npm registrou **50 apontamentos: 0 críticos, 45 altos e 5 moderados**. Os avisos restantes concentram-se no grafo de ferramentas, incluindo glob/minimatch/picomatch, PostCSS e image-size e seus dependentes. Esse resultado não equivale a comprovar exploração no APK; também não é uma auditoria limpa. A resolução completa exige verificar correções transitivas e/ou atualizar o SDK com novos testes. Não foi aplicado upgrade incompatível indiscriminado com audit fix --force. Relatório local: `artifacts/dependency-audit.json`.

## Reprodução

```bash
npm run check
npm run export:web
npm run test:e2e
npm run test:providers
npx vitest run --config vitest.live.config.mts
npm run build:apk
```

Testes de interface usam Chromium (`PESCALEAD_CHROME` pode apontar para seu executável), servidor local e dados fictícios isolados. O APK não inclui leads de demonstração. Testes reais consultam serviços públicos sem usar Gemini. Logs, screenshots, PDF de teste e APK estão em `artifacts/`, fora do versionamento.
