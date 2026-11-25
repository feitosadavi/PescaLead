# F006 — Análise inicial com IA

- Estado do requisito: Definida; integração proposta.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Categorizar, descrever e propor uma solução original para cada lead selecionado.

## Comportamento e regras

- Separar fatos, hipóteses e perguntas para qualificação.
- Vincular funcionalidades a problemas e benefícios do negócio.
- Apresentar faixas de receita e esforço como estimativas revisáveis.
- Usar triagem antes da análise profunda e não enviar notas privadas sem necessidade.

## Critérios de aceite

A análise contém categoria, descrição, evidências, oportunidades, solução, esforço estimado e dúvidas; falhas da IA não geram análise fictícia.

## Decisões relacionadas

- [ADR-0002 — Arquitetura modular e integrações substituíveis](../adr/0002-arquitetura-modular.md) (Proposta).
- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).
- [ADR-0004 — Prioridade comercial explicável e estimativas revisáveis](../adr/0004-prioridade-explicavel.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).
- [ADR-0008](../adr/0008-regra-de-prioridade-v1.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [ai.ts](../../src/integrations/ai.ts) | Implementação relacionada a F006. |
| [models.ts](../../src/domain/models.ts) | Implementação relacionada a F006. |
| [prospecting.ts](../../src/domain/prospecting.ts) | Implementação relacionada a F006. |
| [usePescaLead.ts](../../src/state/usePescaLead.ts) | Implementação relacionada a F006. |

API Gemini com saída estruturada, lista de campos permitidos e hipóteses locais explícitas implementadas. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Inferência real depende da chave pessoal; nenhuma chave foi fornecida e não foi realizada inferência real.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Conteúdo da análise e possibilidade de pedir informações aprovados pelo usuário. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F006 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | API Gemini com saída estruturada, lista de campos permitidos e hipóteses locais explícitas implementadas. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
