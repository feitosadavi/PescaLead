# F001 — Identidade e navegação

- Estado do requisito: Definida; detalhes visuais propostos.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Aplicar o nome PescaLead e a temática de pesca à navegação, estados vazios e elementos visuais, mantendo clareza comercial.

## Comportamento e regras

- Usar sonar, ondas e referências discretas à pesca.
- Paleta proposta: azul profundo, verde-água e coral; navegação proposta: Sonar, Oportunidades, Carteira e Ajustes.
- Manter textos acessíveis e documentos comerciais legíveis.

## Critérios de aceite

O nome PescaLead aparece no aplicativo; navegação e estados visuais têm identidade consistente e contraste legível.

## Decisões relacionadas

- [ADR-0001 — Escopo pessoal e entrega Android](../adr/0001-escopo-pessoal-android.md) (Aceita).
- [ADR-0006 — Identidade temática de pesca](../adr/0006-identidade-tematica.md) (Aceita).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).

- [ADR-0009](../adr/0009-assinatura-e-permissoes.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [App.tsx](../../App.tsx) | Implementação relacionada a F001. |
| [index.ts](../../src/theme/index.ts) | Implementação relacionada a F001. |
| [ui.tsx](../../src/components/ui.tsx) | Implementação relacionada a F001. |
| [SearchScreen.tsx](../../src/features/search/SearchScreen.tsx) | Implementação relacionada a F001. |

Identidade, quatro abas e sonar implementados; conferência visual e teste web realizados. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

Código adicional: [ícone Android](../../plugins/withBranding.js).

## Pendências

Validar acessibilidade e apresentação no aparelho alvo.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Nome e temática definidos pelo usuário; paleta e navegação registradas como propostas. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F001 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Identidade, quatro abas e sonar implementados; conferência visual e teste web realizados. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
| 2026-11-17 | Ícone e/ou assinatura pessoal e manifesto final vinculados ao ADR-0009. | Inspeção do pacote Android. | apksigner e aapt verificaram o APK gerado. |
