# ADR-0003 — Fontes de dados e prioridade à gratuidade

- Estado: Substituída.
- Data do registro: 2026-11-17.
- Origem: Gratuidade e consulta ampla definidas pelo usuário; seleção concreta de fornecedores proposta.
- Implementação: ver ADR substituto e documentos funcionais.
- Substitui: nenhum ADR.
- Substituído por: [ADR-0007](0007-implementacao-expo-local.md).

## Contexto

A descoberta, as imagens e a análise precisam de dados úteis, mas fontes gratuitas podem ter cobertura e condições incompatíveis com algumas etapas.

## Decisão proposta

Propor OpenStreetMap/Overpass para descoberta, sites oficiais permitidos para enriquecimento e uma API de IA com modalidade gratuita, avaliando Gemini. Validar geocodificação antes de escolher fornecedor. Preservar origem, data, atribuições e restrições. Avaliar Google Places separadamente; abrir rota no Google Maps não exige adotá-lo como fonte.

## Alternativas consideradas

Google Places como fonte exclusiva pode não atender custo e uso pretendido. Coleta indiscriminada não garante permissão, qualidade ou estabilidade. Dados abertos isolados podem ser insuficientes.

## Consequências

Não garantir fotos, avaliações ou proprietário identificado para todo lead. Não ativar consumo pago implicitamente. Respeitar cotas; teste de cobertura é pré-requisito para fechar fornecedores.

## Validação e revisão

Validar em uma região representativa e consultar políticas e preços atuais antes de ativar cada integração.

Na criação deste ADR, não havia código ou validação de implementação. O estado atual está no ADR substituto.

## Funcionalidades e código relacionados

Os documentos abaixo registram o histórico funcional e os caminhos planejados de código. Ainda não há links de implementação.

- [F002 — Localização, endereço e raio](../features/F002-localizacao-e-raio.md)
- [F003 — Descoberta, seleção e duplicados](../features/F003-descoberta-e-selecao.md)
- [F004 — Enriquecimento e evidências](../features/F004-enriquecimento-e-evidencias.md)
- [F005 — Imagens dos estabelecimentos](../features/F005-imagens-e-atribuicoes.md)
- [F006 — Análise inicial com IA](../features/F006-analise-inicial-ia.md)
- [F011 — Rota no Google Maps](../features/F011-rota-google-maps.md)
- [F015 — Configurações, cotas e custos](../features/F015-configuracoes-cotas-e-custos.md)

## Histórico

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | ADR criado com estado Proposta. | Gratuidade e consulta ampla definidas pelo usuário; seleção concreta de fornecedores proposta. |
| 2026-11-17 | Substituído por ADR-0007; proposta original preservada como histórico. | Implementação solicitada pelo usuário. |
