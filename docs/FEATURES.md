# Mapa de funcionalidades e código

Atualizado em 2026-11-17. Escopo: [CONTEXT.MD](../CONTEXT.MD). Verificação: [VALIDACAO.md](VALIDACAO.md). Decisões: [ADRs](adr/README.md).

Os links abaixo apontam para arquivos existentes. Cada documento funcional mantém requisitos, critérios, pendências, decisões e histórico. Código implementado não implica teste nativo em aparelho nem chamada real de IA sem credencial.

| ID | Funcionalidade e histórico | Estado | Código existente |
| --- | --- | --- | --- |
| F001 | [Identidade e navegação](features/F001-identidade-e-navegacao.md) | Código implementado; validação descrita no documento. | [App.tsx](../App.tsx)<br>[index.ts](../src/theme/index.ts)<br>[ui.tsx](../src/components/ui.tsx) |
| F002 | [Localização, endereço e raio](features/F002-localizacao-e-raio.md) | Código implementado; validação descrita no documento. | [SearchScreen.tsx](../src/features/search/SearchScreen.tsx)<br>[discovery.ts](../src/integrations/discovery.ts)<br>[device.ts](../src/integrations/device.ts) |
| F003 | [Descoberta, seleção e duplicados](features/F003-descoberta-e-selecao.md) | Código implementado; validação descrita no documento. | [discovery.ts](../src/integrations/discovery.ts)<br>[prospecting.ts](../src/domain/prospecting.ts)<br>[usePescaLead.ts](../src/state/usePescaLead.ts) |
| F004 | [Enriquecimento e evidências](features/F004-enriquecimento-e-evidencias.md) | Código implementado; validação descrita no documento. | [discovery.ts](../src/integrations/discovery.ts)<br>[enrichment.ts](../src/integrations/enrichment.ts)<br>[usePescaLead.ts](../src/state/usePescaLead.ts) |
| F005 | [Imagens dos estabelecimentos](features/F005-imagens-e-atribuicoes.md) | Código implementado; validação descrita no documento. | [enrichment.ts](../src/integrations/enrichment.ts)<br>[device.ts](../src/integrations/device.ts)<br>[LeadDetail.tsx](../src/features/leads/LeadDetail.tsx) |
| F006 | [Análise inicial com IA](features/F006-analise-inicial-ia.md) | Código implementado; validação descrita no documento. | [ai.ts](../src/integrations/ai.ts)<br>[models.ts](../src/domain/models.ts)<br>[prospecting.ts](../src/domain/prospecting.ts) |
| F007 | [Ranking de prioridade comercial](features/F007-priorizacao-comercial.md) | Código implementado; validação descrita no documento. | [prospecting.ts](../src/domain/prospecting.ts)<br>[LeadListScreen.tsx](../src/features/opportunities/LeadListScreen.tsx)<br>[LeadDetail.tsx](../src/features/leads/LeadDetail.tsx) |
| F008 | [Análise detalhada e cobrança](features/F008-analise-detalhada-e-cobranca.md) | Código implementado; validação descrita no documento. | [prospecting.ts](../src/domain/prospecting.ts)<br>[models.ts](../src/domain/models.ts)<br>[ai.ts](../src/integrations/ai.ts) |
| F009 | [PDF da proposta e compartilhamento](features/F009-pdf-e-compartilhamento.md) | Código implementado; validação descrita no documento. | [proposal-html.ts](../src/integrations/proposal-html.ts)<br>[device.ts](../src/integrations/device.ts)<br>[LeadDetail.tsx](../src/features/leads/LeadDetail.tsx) |
| F010 | [Carteira, status, notas e histórico](features/F010-carteira-status-e-notas.md) | Código implementado; validação descrita no documento. | [LeadDetail.tsx](../src/features/leads/LeadDetail.tsx)<br>[LeadListScreen.tsx](../src/features/opportunities/LeadListScreen.tsx)<br>[usePescaLead.ts](../src/state/usePescaLead.ts) |
| F011 | [Rota no Google Maps](features/F011-rota-google-maps.md) | Código implementado; validação descrita no documento. | [links.ts](../src/integrations/links.ts)<br>[LeadDetail.tsx](../src/features/leads/LeadDetail.tsx) |
| F012 | [Contato pelo WhatsApp](features/F012-contato-whatsapp.md) | Código implementado; validação descrita no documento. | [links.ts](../src/integrations/links.ts)<br>[LeadDetail.tsx](../src/features/leads/LeadDetail.tsx) |
| F013 | [Persistência local e uso sem conexão](features/F013-persistencia-e-offline.md) | Código implementado; validação descrita no documento. | [repository.ts](../src/storage/repository.ts)<br>[usePescaLead.ts](../src/state/usePescaLead.ts)<br>[models.ts](../src/domain/models.ts) |
| F014 | [Backup e restauração](features/F014-backup-e-restauracao.md) | Código implementado; validação descrita no documento. | [backup.ts](../src/domain/backup.ts)<br>[device.ts](../src/integrations/device.ts)<br>[SettingsScreen.tsx](../src/features/settings/SettingsScreen.tsx) |
| F015 | [Configurações, cotas e custos](features/F015-configuracoes-cotas-e-custos.md) | Código implementado; validação descrita no documento. | [SettingsScreen.tsx](../src/features/settings/SettingsScreen.tsx)<br>[models.ts](../src/domain/models.ts)<br>[usePescaLead.ts](../src/state/usePescaLead.ts) |
| F016 | [Android e distribuição por APK](features/F016-android-e-distribuicao.md) | Código implementado; validação descrita no documento. | [package.json](../package.json)<br>[app.config.ts](../app.config.ts)<br>[build-android.sh](../scripts/build-android.sh) |

Backup foi incluído como extensão local. As escolhas técnicas foram concretizadas nos ADRs 0007 e 0008; registros anteriores permanecem disponíveis. Nenhum dado de demonstração integra o aplicativo.
