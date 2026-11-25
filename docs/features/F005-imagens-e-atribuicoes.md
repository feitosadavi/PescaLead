# F005 — Imagens dos estabelecimentos

- Estado do requisito: Definida; execução condicionada à fonte.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Exibir e, quando permitido, baixar imagens reais relacionadas ao estabelecimento.

## Comportamento e regras

- Registrar origem, autoria, atribuição e condições de uso conhecidas.
- Baixar ou persistir somente quando permitido pela fonte.
- Usar imagem temática claramente ilustrativa se não houver fotografia utilizável.

## Critérios de aceite

Fotografias têm atribuição quando exigida; ilustrações não se passam por fotos reais; armazenamento respeita a origem.

## Decisões relacionadas

- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).
- [ADR-0006 — Identidade temática de pesca](../adr/0006-identidade-tematica.md) (Aceita).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [enrichment.ts](../../src/integrations/enrichment.ts) | Implementação relacionada a F005. |
| [device.ts](../../src/integrations/device.ts) | Implementação relacionada a F005. |
| [LeadDetail.tsx](../../src/features/leads/LeadDetail.tsx) | Implementação relacionada a F005. |

Consulta de referência Commons, validação de licença, atribuição e download local implementados. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar download nativo com lead que tenha referência Commons real; cobertura não é garantida.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Requisito de imagens preservado do prompt inicial; implementação depende da fonte. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F005 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Consulta de referência Commons, validação de licença, atribuição e download local implementados. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
