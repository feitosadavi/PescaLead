# ADR-0001 — Escopo pessoal e entrega Android

- Estado: Aceita.
- Data do registro: 2026-11-17.
- Origem: Requisitos expressos pelo usuário.
- Implementação: código criado; ver funcionalidades relacionadas e relatório de validação.
- Substitui: nenhum ADR.
- Substituído por: nenhum ADR.

## Contexto

O produto atende à prospecção e ao acompanhamento comercial de uma pessoa, sem necessidade atual de uma plataforma para equipes.

## Decisão

Adotar PescaLead como aplicativo React Native para Android, distribuído por APK para uso pessoal. Buscar por endereço ou localização nos raios de 10 a 50 km, de 10 em 10. Incluir propostas individuais, PDF, carteira, status, notas, Maps e WhatsApp. Tarefas ficam no Trello.

## Alternativas consideradas

Aplicativo para equipes, SaaS, publicação inicial na Play Store e tarefas integradas: não correspondem ao escopo solicitado.

## Consequências

Simplifica o escopo inicial. Não resolve ainda banco, autenticação local, serviço de apoio ou processo de build. Trello não implica integração automática.

## Validação e revisão

Reavaliar se houver múltiplos usuários, distribuição pública ou necessidade de tarefas no app.

Na criação deste ADR, não havia implementação. O estado atual está nos documentos funcionais e no relatório de validação.

## Funcionalidades e código relacionados

Os documentos abaixo registram histórico, código existente e limites da validação.

- [F001 — Identidade e navegação](../features/F001-identidade-e-navegacao.md)
- [F002 — Localização, endereço e raio](../features/F002-localizacao-e-raio.md)
- [F003 — Descoberta, seleção e duplicados](../features/F003-descoberta-e-selecao.md)
- [F008 — Análise detalhada e cobrança](../features/F008-analise-detalhada-e-cobranca.md)
- [F009 — PDF da proposta e compartilhamento](../features/F009-pdf-e-compartilhamento.md)
- [F010 — Carteira, status, notas e histórico](../features/F010-carteira-status-e-notas.md)
- [F011 — Rota no Google Maps](../features/F011-rota-google-maps.md)
- [F012 — Contato pelo WhatsApp](../features/F012-contato-whatsapp.md)
- [F016 — Android e distribuição por APK](../features/F016-android-e-distribuicao.md)

## Histórico

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | ADR criado com estado Aceita. | Requisitos expressos pelo usuário. |
