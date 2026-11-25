# F003 — Descoberta, seleção e duplicados

- Estado do requisito: Definida; quantidade configurável interpretada.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Buscar estabelecimentos e apresentar uma seleção dos candidatos mais promissores, preservando leads já salvos.

## Comportamento e regras

- Quantidade de resultados ajustável; interpretar inicialmente o termo 'valor' da resposta 6 como quantidade de leads.
- Restringir a seleção à cobertura e aos limites das fontes consultadas.
- Remover duplicados por identificadores e evidências; não fundir negócios ambíguos.
- Preservar notas e status ao reencontrar um lead; mostrar progresso e resultados parciais.

## Critérios de aceite

Repetir uma busca não duplica leads salvos nem apaga seu histórico; a seleção respeita o raio e explicita cobertura parcial.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).
- [ADR-0004 — Prioridade comercial explicável e estimativas revisáveis](../adr/0004-prioridade-explicavel.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).
- [ADR-0008](../adr/0008-regra-de-prioridade-v1.md) (Aceita).

- [ADR-0010](../adr/0010-consulta-espacial-e-cobertura-parcial.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [discovery.ts](../../src/integrations/discovery.ts) | Implementação relacionada a F003. |
| [prospecting.ts](../../src/domain/prospecting.ts) | Implementação relacionada a F003. |
| [usePescaLead.ts](../../src/state/usePescaLead.ts) | Implementação relacionada a F003. |
| [LeadListScreen.tsx](../../src/features/opportunities/LeadListScreen.tsx) | Implementação relacionada a F003. |

Busca real GET, seleção limitada, fusão conservadora, preservação do CRM e indicação de cobertura implementadas. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

A seleção depende da cobertura pública e não garante todos os negócios da região.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Seleção dos melhores definida pelo usuário; significado de 'valor' documentado como interpretação. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F003 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Busca real GET, seleção limitada, fusão conservadora, preservação do CRM e indicação de cobertura implementadas. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
| 2026-11-17 | Ajuste espacial da consulta para caixas e filtro circular exato; preservado o limite de 1.500 elementos. | Teste real expôs timeout na região de São Paulo. | Teste de serviço real registrado no relatório. |
| 2026-11-17 | Cobertura reduzida explicitada quando há recuperação por amostra central de 1 km; não repetir cotas. | Limitações reais de servidor registradas no ADR-0010. | Testes de integração e chamada real opcional. |
