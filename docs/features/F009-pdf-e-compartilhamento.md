# F009 — PDF da proposta e compartilhamento

- Estado do requisito: Definida.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Gerar um PDF comercial revisado pelo usuário e compartilhá-lo pelo Android.

## Comportamento e regras

- Incluir marca, identificação do prestador, solução, escopo, preços e condições.
- Separar conteúdo comercial de notas internas e análise de prioridade.
- Usar compartilhamento nativo e gerar o documento a partir da versão revisada.

## Critérios de aceite

PDF legível pode ser aberto e compartilhado; valores correspondem à revisão e notas internas ficam fora do documento.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0006 — Identidade temática de pesca](../adr/0006-identidade-tematica.md) (Aceita).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [proposal-html.ts](../../src/integrations/proposal-html.ts) | Implementação relacionada a F009. |
| [device.ts](../../src/integrations/device.ts) | Implementação relacionada a F009. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F009. |

Proposta comercial isolada das notas, HTML escapado e exportação PDF implementados; PDF web verificado. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar geração e compartilhamento nativo no aparelho Android.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Compartilhamento em PDF definido pelo usuário. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F009 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Proposta comercial isolada das notas, HTML escapado e exportação PDF implementados; PDF web verificado. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
