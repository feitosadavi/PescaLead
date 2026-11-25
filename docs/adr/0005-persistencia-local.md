# ADR-0005 — Persistência local, offline e recuperação

- Estado: Substituída.
- Data do registro: 2026-11-17.
- Origem: Carteira e notas persistentes decorrem do uso solicitado; offline ampliado e backup são propostas.
- Implementação: ver ADR substituto e documentos funcionais.
- Substitui: nenhum ADR.
- Substituído por: [ADR-0007](0007-implementacao-expo-local.md).

## Contexto

O usuário precisa manter seu histórico de prospecção entre sessões. Não há requisito de sincronização entre aparelhos.

## Decisão proposta

Propor armazenamento local para dados permitidos da carteira, notas e configurações. Permitir consultar carteira e editar notas offline; manter busca e IA remotas dependentes de internet. Considerar backup em arquivo como extensão proposta, com formato versionado e validação antes de restaurar.

## Alternativas consideradas

Somente memória perde dados entre sessões. Nuvem obrigatória acrescenta dependência e operação. Offline integral exigiria fontes e modelo local ainda não previstos.

## Consequências

Banco, migrações, retenção e proteção ainda precisam ser definidos. Persistência depende das condições de cada fonte. Backup não integra automaticamente o mínimo confirmado.

## Validação e revisão

Resolver ao definir o modelo de dados; reavaliar se surgirem sincronização, troca de aparelho ou uso em equipe.

Na criação deste ADR, não havia código ou validação de implementação. O estado atual está no ADR substituto.

## Funcionalidades e código relacionados

Os documentos abaixo registram o histórico funcional e os caminhos planejados de código. Ainda não há links de implementação.

- [F010 — Carteira, status, notas e histórico](../features/F010-carteira-status-e-notas.md)
- [F013 — Persistência local e uso sem conexão](../features/F013-persistencia-e-offline.md)
- [F014 — Backup e restauração](../features/F014-backup-e-restauracao.md)

## Histórico

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | ADR criado com estado Proposta. | Carteira e notas persistentes decorrem do uso solicitado; offline ampliado e backup são propostas. |
| 2026-11-17 | Substituído por ADR-0007; proposta original preservada como histórico. | Implementação solicitada pelo usuário. |
