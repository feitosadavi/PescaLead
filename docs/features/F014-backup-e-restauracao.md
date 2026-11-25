# F014 — Backup e restauração

- Estado do requisito: Extensão local implementada durante o desenvolvimento autorizado.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Exportar e restaurar dados pessoais de prospecção por arquivo.

## Comportamento e regras

- Incluir versão do formato e validar o arquivo antes de importar.
- Evitar exportação indevida de credenciais ou conteúdo de terceiros restrito.
- Definir tratamento de duplicados e conflitos sem sobrescrita silenciosa.

## Critérios de aceite

Quando aprovada e implementada, uma exportação pode ser restaurada sem perder notas e status; arquivo inválido não altera a carteira.

## Decisões relacionadas

- [ADR-0005 — Persistência local, offline e recuperação](../adr/0005-persistencia-local.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [backup.ts](../../src/domain/backup.ts) | Implementação relacionada a F014. |
| [device.ts](../../src/integrations/device.ts) | Implementação relacionada a F014. |
| [SettingsScreen.tsx](../../src/features/settings/SettingsScreen.tsx) | Implementação relacionada a F014. |

Extensão de backup implementada com validação, prévia, confirmação e importação somente de IDs novos. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar seletor e compartilhamento de arquivo nativos; conflitos preservam o lead já existente.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Recurso sugerido na especificação inicial; não foi solicitado explicitamente pelo usuário. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F014 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Extensão de backup implementada com validação, prévia, confirmação e importação somente de IDs novos. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
