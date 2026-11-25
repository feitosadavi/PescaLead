# F011 — Rota no Google Maps

- Estado do requisito: Definida.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Abrir o Google Maps para visitar um estabelecimento.

## Comportamento e regras

- Usar dados de destino válidos.
- Tentar versão web quando o aplicativo não estiver disponível.
- Abrir um destino por ação; não incluir otimização de múltiplas visitas na primeira versão.

## Critérios de aceite

A ação abre o estabelecimento correto e trata destino inválido ou indisponibilidade do aplicativo.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [links.ts](../../src/integrations/links.ts) | Implementação relacionada a F011. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F011. |

Link Google Maps com destino em coordenadas implementado; construção do destino testada. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar abertura no app Maps ou navegador do aparelho alvo.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Usuário definiu abertura do Maps; planejamento de rotas múltiplas não foi solicitado. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F011 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Link Google Maps com destino em coordenadas implementado; construção do destino testada. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
