# Documentação do PescaLead

Atualização inicial: 2026-11-17. O código da primeira versão foi implementado; resultados e limitações da verificação estão em [VALIDACAO.md](VALIDACAO.md).

## Pontos de entrada

| Documento | Responsabilidade |
| --- | --- |
| [CONTEXT.MD](../CONTEXT.MD) | Contexto, escopo, restrições e premissas do produto. |
| [FEATURES.md](FEATURES.md) | Índice das 16 funcionalidades, estado, decisões e módulos relacionados. |
| [features/](features/README.md) | Requisitos, critérios de aceite, histórico e referências ao código por funcionalidade. |
| [adr/](adr/README.md) | Histórico de decisões relevantes, incluindo alternativas e consequências. |

## Convenções

- IDs F001–F016 e números de ADR são estáveis; não reutilizar um ID removido.
- Estado de requisito: definida, proposta ou interpretação pendente, conforme o documento funcional. Estado de implementação é independente: não iniciada, em andamento, implementada ou removida.
- Estado de ADR: Proposta, Aceita, Rejeitada, Substituída ou Obsoleta. Somente registrar como aceita uma decisão sustentada pelos requisitos ou por uma escolha técnica efetivamente tomada; documentar a origem.
- Cada documento funcional aponta para seus ADRs. Cada ADR aponta de volta para as funcionalidades afetadas.
- Caminhos de código planejados são texto sem link e não significam que o arquivo existe. Quando implementados, adicionar links relativos verificáveis, símbolos relevantes, validação realizada e commit ou PR quando disponíveis.
- Não registrar código, validação, hash de commit ou aprovação inexistentes. A criação de documentação não representa implementação do produto.

## Fluxo de atualização junto ao código

1. Identificar os IDs afetados antes da alteração.
2. Ajustar requisitos e critérios no documento funcional. Se o escopo mudar, atualizar também CONTEXT.MD.
3. Para uma decisão arquitetural nova, usar o [modelo de ADR](adr/TEMPLATE.md) e o próximo número livre. Para ajuste pequeno de comportamento, o histórico funcional basta.
4. Implementar e verificar o comportamento; adicionar referências reais ao código e às validações no documento funcional. Os caminhos propostos podem mudar conforme a arquitetura escolhida.
5. Acrescentar uma entrada ao histórico: data, mudança, motivo, decisão e código/commit/PR disponível. Não apagar entradas anteriores.
6. Atualizar estado e referências no índice FEATURES.md. Se uma proposta for aceita, registrar data, responsável e fundamento no histórico do ADR.
7. Ao substituir uma decisão aceita, criar um novo ADR com vínculo ao anterior; atualizar os metadados do antigo para Substituída e indicar o substituto. Preservar a justificativa histórica.

Não é preciso criar um ADR para cada edição. Um ADR pode orientar várias funcionalidades; cada funcionalidade mantém seu próprio histórico de mudanças.

## Modelos

- [Documento de funcionalidade](features/TEMPLATE.md)
- [ADR](adr/TEMPLATE.md)

Os históricos iniciais descrevem decisões de produto e organização documental. Não são um log de execução do aplicativo e não substituem o histórico técnico do Git.
