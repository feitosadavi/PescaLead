# F016 — Android e distribuição por APK

- Estado do requisito: Definida; ferramentas propostas.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Entregar aplicativo React Native Android instalável para um único usuário.

## Comportamento e regras

- Sem conta pública, equipes ou assinatura no escopo inicial.
- Sem publicação na Play Store como requisito inicial.
- Validar dependências e permissões no Android alvo; documentar geração e instalação do APK.

## Critérios de aceite

APK instala e abre em dispositivo de teste; nome público é PescaLead e os fluxos implementados funcionam fora do ambiente de desenvolvimento.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0002 — Arquitetura modular e integrações substituíveis](../adr/0002-arquitetura-modular.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

- [ADR-0009](../adr/0009-assinatura-e-permissoes.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [package.json](../../package.json) | Implementação relacionada a F016. |
| [app.config.ts](../../app.config.ts) | Implementação relacionada a F016. |
| [build-android.sh](../../scripts/build-android.sh) | Implementação relacionada a F016. |
| [index.ts](../../index.ts) | Implementação relacionada a F016. |
| [build-android.md](../../docs/build-android.md) | Implementação relacionada a F016. |

Projeto React Native/Expo, configuração Android e script de APK implementados; APK release gerado e assinatura verificada; execução nativa pendente. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

Código adicional: [assinatura pessoal](../../scripts/configure-signing.mjs) e [ícone](../../plugins/withBranding.js).

## Pendências

Instalação e abertura em aparelho Android ainda precisam ser validadas. Compilação e assinatura passaram; o emulador isolado não disponibilizou os serviços Android necessários.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | React Native, Android e APK pessoal definidos pelo usuário; ferramentas de build permanecem propostas. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F016 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Projeto React Native/Expo, configuração Android e script de APK implementados; APK release gerado e assinatura verificada; execução nativa pendente. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
| 2026-11-17 | Ícone e/ou assinatura pessoal e manifesto final vinculados ao ADR-0009. | Inspeção do pacote Android. | apksigner e aapt verificaram o APK gerado. |
| 2026-11-17 | APK release gerado para arm64-v8a e x86_64, assinado e inspecionado. Abertura em Android não validada. | Resultado de build, apksigner, aapt e tentativa em emulador isolado. | Ver VALIDACAO.md; não confundir compilação com teste de dispositivo. |
