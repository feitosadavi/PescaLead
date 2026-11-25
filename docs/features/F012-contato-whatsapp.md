# F012 — Contato pelo WhatsApp

- Estado do requisito: Definida.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Abrir uma conversa com o número comercial disponível para o lead.

## Comportamento e regras

- Normalizar telefone e país quando houver informação suficiente.
- Não presumir que todo telefone possui conta WhatsApp.
- Não enviar mensagens automaticamente; informar ausência de contato utilizável.

## Critérios de aceite

Número válido abre a conversa; falta de número é tratada sem abrir destinatário incorreto.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [links.ts](../../src/integrations/links.ts) | Implementação relacionada a F012. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F012. |

WhatsApp com normalização brasileira/internacional e ausência de contato tratada; sem envio automático. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar número com conta WhatsApp e abertura no aparelho alvo.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Botão WhatsApp solicitado pelo usuário. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F012 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | WhatsApp com normalização brasileira/internacional e ausência de contato tratada; sem envio automático. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
