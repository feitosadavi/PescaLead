# F013 — Persistência local e uso sem conexão

- Estado do requisito: Persistência definida; offline ampliado proposto.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Preservar carteira, notas e configurações e permitir acesso aos dados locais sem conexão.

## Comportamento e regras

- Persistir somente dados cuja origem permita armazenamento.
- Busca, enriquecimento e análise remota dependem de internet.
- Proposta: consultar carteira e editar notas offline.
- Tratar falhas de gravação e evolução do esquema de dados.

## Critérios de aceite

Dados salvos reaparecem ao reabrir; alterações offline permitidas são preservadas; etapas remotas explicam a necessidade de conexão.

## Decisões relacionadas

- [ADR-0002 — Arquitetura modular e integrações substituíveis](../adr/0002-arquitetura-modular.md) (Proposta).
- [ADR-0005 — Persistência local, offline e recuperação](../adr/0005-persistencia-local.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [repository.ts](../../src/storage/repository.ts) | Implementação relacionada a F013. |
| [usePescaLead.ts](../../src/state/usePescaLead.ts) | Implementação relacionada a F013. |
| [models.ts](../../src/domain/models.ts) | Implementação relacionada a F013. |

Snapshot validado, fila de gravação e preservação de dados corrompidos implementados; notas offline verificadas no fluxo web. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar persistência e reabertura no aparelho Android; considerar banco relacional se o volume crescer.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Persistência decorre da gestão dos leads; consulta e notas offline foram propostas, sem confirmação específica. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F013 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Snapshot validado, fila de gravação e preservação de dados corrompidos implementados; notas offline verificadas no fluxo web. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
