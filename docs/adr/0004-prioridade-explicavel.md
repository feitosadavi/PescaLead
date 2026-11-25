# ADR-0004 — Prioridade comercial explicável e estimativas revisáveis

- Estado: Substituída.
- Data do registro: 2026-11-17.
- Origem: Usuário delegou avaliação caso a caso e definiu plano de faturamento como cobrança; método técnico é proposto.
- Implementação: ver ADR substituto e documentos funcionais.
- Substitui: nenhum ADR.
- Substituído por: [ADR-0008](0008-regra-de-prioridade-v1.md).

## Contexto

Não existe histórico de vendas para calibrar uma probabilidade de fechamento; nota pública não comprova faturamento ou capacidade de investimento.

## Decisão proposta

Propor ranking por atratividade estimada: implantação, recorrência, entrega, manutenção, adequação, demanda e acesso ao decisor. Separar qualidade das evidências da prioridade. Usar avaliações como sinal contextual. Gerar preços e esforços em faixas revisáveis, com premissas e edição manual. Não fixar pesos antes da validação.

## Alternativas consideradas

Ordenar só por nota ou ticket ignora esforço e adequação. Exibir porcentagem de fechamento sem base histórica sugere precisão indevida.

## Consequências

Requer explicação dos fatores, marcação de fatos e hipóteses e versão da regra de pontuação. Análises e propostas são apoio à decisão, sem garantia de receita.

## Validação e revisão

Reavaliar com exemplos reais e histórico suficiente de propostas ganhas e perdidas; registrar fórmula e pesos em decisão posterior.

Na criação deste ADR, não havia código ou validação de implementação. O estado atual está no ADR substituto.

## Funcionalidades e código relacionados

Os documentos abaixo registram o histórico funcional e os caminhos planejados de código. Ainda não há links de implementação.

- [F003 — Descoberta, seleção e duplicados](../features/F003-descoberta-e-selecao.md)
- [F006 — Análise inicial com IA](../features/F006-analise-inicial-ia.md)
- [F007 — Ranking de prioridade comercial](../features/F007-priorizacao-comercial.md)
- [F008 — Análise detalhada e cobrança](../features/F008-analise-detalhada-e-cobranca.md)
- [F015 — Configurações, cotas e custos](../features/F015-configuracoes-cotas-e-custos.md)

## Histórico

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | ADR criado com estado Proposta. | Usuário delegou avaliação caso a caso e definiu plano de faturamento como cobrança; método técnico é proposto. |
| 2026-11-17 | Substituído por ADR-0008; proposta original preservada como histórico. | Implementação solicitada pelo usuário. |
