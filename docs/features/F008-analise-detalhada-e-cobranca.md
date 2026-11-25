# F008 — Análise detalhada e cobrança

- Estado do requisito: Definida; parâmetros financeiros propostos.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Aprofundar uma oportunidade sob demanda e produzir a proposta de cobrança dos serviços.

## Comportamento e regras

- Incluir diagnóstico, funcionalidades priorizadas, etapas, prazos estimados, dependências e dúvidas.
- Sugerir implantação e mensalidade quando fizer sentido, considerando custos e manutenção.
- Permitir editar texto, preços, condições e validade.
- Plano de faturamento significa cobrança do prestador; não inferir faturamento real do lead.

## Critérios de aceite

O botão gera análise detalhada revisável; preços e premissas podem ser alterados antes da emissão da proposta.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0004 — Prioridade comercial explicável e estimativas revisáveis](../adr/0004-prioridade-explicavel.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).
- [ADR-0008](../adr/0008-regra-de-prioridade-v1.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [prospecting.ts](../../src/domain/prospecting.ts) | Implementação relacionada a F008. |
| [models.ts](../../src/domain/models.ts) | Implementação relacionada a F008. |
| [ai.ts](../../src/integrations/ai.ts) | Implementação relacionada a F008. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F008. |

Análise detalhada sob demanda, cálculo de margem e editor de escopo/cobrança implementados. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Chamada detalhada real depende da configuração da API; custos de infraestrutura precisam ser definidos por proposta.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Usuário esclareceu plano de faturamento como proposta de cobrança e solicitou personalização por negócio. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F008 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Análise detalhada sob demanda, cálculo de margem e editor de escopo/cobrança implementados. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
