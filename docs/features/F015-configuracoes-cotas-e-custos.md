# F015 — Configurações, cotas e custos

- Estado do requisito: Gratuidade definida; controles propostos.
- Implementação: código implementado; validação nativa conforme relatório.
- Atualizado em: 2026-11-17.
- Contexto: [CONTEXT.MD](../../CONTEXT.MD).
- Índice: [mapa de funcionalidades](../FEATURES.md).

## Objetivo

Configurar busca, parâmetros comerciais e integrações com prioridade à gratuidade.

## Comportamento e regras

- Permitir ajustar quantidade de resultados e preços de propostas.
- Propor ajustes de custo por hora e margem para estimativas transparentes.
- Respeitar cotas, interromper a etapa afetada e não ativar consumo pago implicitamente.
- Manter fornecedores substituíveis e não tratar segredos embutidos no APK como protegidos.

## Critérios de aceite

Limite atingido produz estado claro sem resultado simulado; alterações de parâmetros são persistidas e utilizadas nas próximas operações pertinentes.

## Decisões relacionadas

- [ADR-0002 — Arquitetura modular e integrações substituíveis](../adr/0002-arquitetura-modular.md) (Proposta).
- [ADR-0003 — Fontes de dados e prioridade à gratuidade](../adr/0003-fontes-e-gratuidade.md) (Proposta).
- [ADR-0004 — Prioridade comercial explicável e estimativas revisáveis](../adr/0004-prioridade-explicavel.md) (Proposta).

- [ADR-0007](../adr/0007-implementacao-expo-local.md) (Aceita).
- [ADR-0008](../adr/0008-regra-de-prioridade-v1.md) (Aceita).

- [ADR-0009](../adr/0009-assinatura-e-permissoes.md) (Aceita).

- [ADR-0010](../adr/0010-consulta-espacial-e-cobertura-parcial.md) (Aceita).

## Código relacionado

| Arquivo existente | Relação com a funcionalidade |
| --- | --- |
| [SettingsScreen.tsx](../../src/features/settings/SettingsScreen.tsx) | Implementação relacionada a F015. |
| [models.ts](../../src/domain/models.ts) | Implementação relacionada a F015. |
| [usePescaLead.ts](../../src/state/usePescaLead.ts) | Implementação relacionada a F015. |
| [device.ts](../../src/integrations/device.ts) | Implementação relacionada a F015. |

Ajustes, chave protegida no Android, cota local, modelo configurável e limites explícitos implementados. Consulte as verificações em [VALIDACAO.md](../VALIDACAO.md) e os [testes de interface](../../e2e/flows.spec.ts). Nenhum commit ou PR foi criado nesta etapa.

## Pendências

O app não verifica se o projeto da chave está em plano gratuito; conferir cotas no provedor.

## Histórico de decisões e alterações

| Data | Decisão ou alteração | Motivo / origem | Código / validação |
| --- | --- | --- | --- |
| 2026-11-17 | Prioridade à gratuidade definida pelo usuário; controles e parâmetros são propostas de implementação. | Prompt inicial e respostas do usuário; propostas identificadas no contexto. | Sem implementação; sem validação funcional. |
| 2026-11-17 | Criado documento F015 com vínculos aos ADRs e caminhos planejados. | Pedido do usuário de documentação rastreável. | Documentação apenas. |
| 2026-11-17 | Ajustes, chave protegida no Android, cota local, modelo configurável e limites explícitos implementados. | Implementação solicitada pelo usuário; decisões técnicas nos ADRs novos. | Código existente relacionado acima; ver relatório de validação. |
| 2026-11-17 | Ícone e/ou assinatura pessoal e manifesto final vinculados ao ADR-0009. | Inspeção do pacote Android. | apksigner e aapt verificaram o APK gerado. |
| 2026-11-17 | Cobertura reduzida explicitada quando há recuperação por amostra central de 1 km; não repetir cotas. | Limitações reais de servidor registradas no ADR-0010. | Testes de integração e chamada real opcional. |
