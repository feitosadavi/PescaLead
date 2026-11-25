# F004 — Enriquecimento e evidências

- Estado do requisito: Definida; provedores propostos.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Consultar o máximo de informações públicas úteis e permitidas para apoiar a análise comercial.

## Comportamento e regras

- Registrar fonte e data de consulta das informações relevantes.
- Buscar nome, categoria, endereço, site, contato comercial, horários, avaliações e sinais digitais quando disponíveis.
- Não inventar dados ausentes nem confirmar acesso ao proprietário sem evidência.
- Respeitar restrições da fonte e evitar coleta indiscriminada de dados pessoais.

## Critérios de aceite

Informações relevantes têm origem rastreável; dados ausentes e sinais não confirmados aparecem claramente.

## Decisões relacionadas

- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [discovery.ts](../../src/integrations/discovery.ts) | Implementação relacionada a F004. |
| [enrichment.ts](../../src/integrations/enrichment.ts) | Implementação relacionada a F004. |
| [usePescaLead.ts](../../src/state/usePescaLead.ts) | Implementação relacionada a F004. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F004. |

Evidências OSM e consulta de título/descrição do site implementadas; fonte e data preservadas. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Enriquecimento inicial limitado à página oficial indicada; sem busca irrestrita na web ou avaliações Google.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Amplitude da consulta solicitada pelo usuário; estratégia de fontes permanece proposta. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F004 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Evidências OSM e consulta de título/descrição do site implementadas; fonte e data preservadas. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
