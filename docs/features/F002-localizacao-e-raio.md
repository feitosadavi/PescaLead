# F002 — Localização, endereço e raio

- Estado do requisito: Definida; distância em linha reta proposta.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Definir a origem da busca por endereço digitado ou localização atual e escolher um raio.

## Comportamento e regras

- Oferecer apenas 10, 20, 30, 40 e 50 km.
- Tratar permissão negada permitindo digitar um endereço.
- Proposta: usar distância em linha reta para delimitar a área; confirmar o endereço quando houver ambiguidade.

## Critérios de aceite

Os cinco raios podem ser selecionados; localização e endereço funcionam como origens alternativas; uma falha não usa coordenadas fictícias.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

- [ADR-0010](../adr/0010-consulta-espacial-e-cobertura-parcial.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [SearchScreen.tsx](../../src/features/search/SearchScreen.tsx) | Implementação relacionada a F002. |
| [discovery.ts](../../src/integrations/discovery.ts) | Implementação relacionada a F002. |
| [device.ts](../../src/integrations/device.ts) | Implementação relacionada a F002. |

Endereço com confirmação, GPS e cinco raios implementados; Photon testado com endereço público real. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

Validar GPS e permissões no aparelho Android.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Origem e raios definidos pelo usuário; critério geométrico registrado como proposta. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F002 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Endereço com confirmação, GPS e cinco raios implementados; Photon testado com endereço público real. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
| 2026-11-17 | Cobertura reduzida explicitada quando há recuperação por amostra central de 1 km; não repetir cotas. | Limitações reais de servidor registradas no ADR-0010. | Testes de integração e chamada real opcional. |
