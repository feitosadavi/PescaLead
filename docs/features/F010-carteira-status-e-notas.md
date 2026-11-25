# F010 — Carteira, status, notas e histórico

- Estado do requisito: Definida.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Administrar leads com acompanhamento comercial e informações registradas pelo usuário.

## Comportamento e regras

- Status: Novo, Qualificado, Contatado, Reunião, Proposta, Ganho e Perdido; mudança manual.
- Manter notas e histórico de alterações, propostas e motivo de perda.
- Filtrar carteira por status, segmento, prioridade e distância.
- Tarefas ficam no Trello; não incluir módulo de tarefas ou integração Trello como requisito inicial.

## Critérios de aceite

Notas e status persistem após reabertura e nova busca; mudanças ficam no histórico; motivo de perda pode ser registrado.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0005 — Persistência local, offline e recuperação](../adr/0005-persistencia-local.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F010. |
| [LeadListScreen.tsx](../../src/features/opportunities/LeadListScreen.tsx) | Implementação relacionada a F010. |
| [usePescaLead.ts](../../src/state/usePescaLead.ts) | Implementação relacionada a F010. |
| [models.ts](../../src/domain/models.ts) | Implementação relacionada a F010. |

Carteira, status, notas privadas, histórico, motivo de perda, filtros e revisão de dados implementados. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar o fluxo com o uso comercial real; tarefas continuam no Trello.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Fluxo de status aceito; usuário excluiu tarefas porque serão administradas no Trello. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F010 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Carteira, status, notas privadas, histórico, motivo de perda, filtros e revisão de dados implementados. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
