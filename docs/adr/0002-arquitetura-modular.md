# ADR-0002 — Arquitetura modular e integrações substituíveis

- Estado: Substituída.
- Data do registro: 2026-11-17.
- Origem: Recomendação técnica; React Native e Android já são requisitos aceitos no ADR-0001.
- Implementação: ver ADR substituto e documentos funcionais.
- Substitui: nenhum ADR.
- Substituído por: [ADR-0007](0007-implementacao-expo-local.md).

## Contexto

Há várias dependências externas com cotas, custos e políticas distintas. O código-fonte do aplicativo ainda não existe.

## Decisão proposta

Propor TypeScript e separação entre funcionalidades, regras de domínio, persistência e integrações. Avaliar Expo conforme dependências e build Android. Isolar descoberta, geocodificação, IA e PDF por interfaces. Adotar serviço de apoio somente se necessário e compatível com o objetivo de custo.

## Alternativas consideradas

Aplicativo monolítico com SDKs espalhados dificulta substituição. Backend obrigatório aumenta operação antes de comprovar a necessidade. Aplicativo totalmente local depende de viabilidade ainda não testada.

## Consequências

Os caminhos de código nos documentos são planejados, sem existência ou stack final presumida. Exige validar limites de execução, bibliotecas e proteção de credenciais.

## Validação e revisão

Resolver na primeira implementação após validar build Android, coleta e uso de APIs.

Na criação deste ADR, não havia código ou validação de implementação. O estado atual está no ADR substituto.

## Funcionalidades e código relacionados

Os documentos abaixo registram o histórico funcional e os caminhos planejados de código. Ainda não há links de implementação.

- [F006 — Análise inicial com IA](../features/F006-analise-inicial-ia.md)
- [F013 — Persistência local e uso sem conexão](../features/F013-persistencia-e-offline.md)
- [F015 — Configurações, cotas e custos](../features/F015-configuracoes-cotas-e-custos.md)
- [F016 — Android e distribuição por APK](../features/F016-android-e-distribuicao.md)

## Histórico

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | ADR criado com estado Proposta. | Recomendação técnica; React Native e Android já são requisitos aceitos no ADR-0001. |
| 2026-11-17 | Substituído por ADR-0007; proposta original preservada como histórico. | Implementação solicitada pelo usuário. |
