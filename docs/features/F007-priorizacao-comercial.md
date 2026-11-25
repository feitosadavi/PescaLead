# F007 — Ranking de prioridade comercial

- Estado do requisito: Definida; fórmula pendente.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Ordenar leads por atratividade comercial estimada, considerando cada caso.

## Comportamento e regras

- Considerar implantação, recorrência, custos de entrega e manutenção, demanda, adequação e acesso ao decisor.
- Usar nota e volume de avaliações como sinais quando disponíveis.
- Exibir justificativa e confiança nos dados separadas da prioridade.
- Não converter pontuação em probabilidade de fechamento sem validação histórica; permitir correção manual.

## Critérios de aceite

Cada posição pode ser explicada pelos sinais utilizados; dados ausentes não são tratados como prova de baixa rentabilidade.

## Decisões relacionadas

- [ADR-0004 — Prioridade comercial explicável e estimativas revisáveis](../adr/0004-prioridade-explicavel.md) (Proposta).

- [ADR-0008](../adr/0008-regra-de-prioridade-v1.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [prospecting.ts](../../src/domain/prospecting.ts) | Implementação relacionada a F007. |
| [LeadListScreen.tsx](../../src/features/opportunities/LeadListScreen.tsx) | Implementação relacionada a F007. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F007. |

Score v1 com fatores explicados, confiança separada, filtros e prioridade manual implementados e testados. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Calibrar utilidade comercial com resultados reais; pesos atuais são heurísticos, sem probabilidade de venda.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Usuário delegou avaliação de rentabilidade por caso; abordagem explicável registrada, sem fórmula aprovada. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F007 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Score v1 com fatores explicados, confiança separada, filtros e prioridade manual implementados e testados. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
