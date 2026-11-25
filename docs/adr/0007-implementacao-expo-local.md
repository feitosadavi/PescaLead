# ADR-0007 — Implementação local com Expo e fontes substituíveis

- Estado: Aceita.
- Data: 2026-11-17.
- Responsável pela escolha técnica: Codex, durante a implementação autorizada pelo usuário.
- Substitui: [ADR-0002](0002-arquitetura-modular.md), [ADR-0003](0003-fontes-e-gratuidade.md) e [ADR-0005](0005-persistencia-local.md).
- Implementação: código criado; conferir resultados de build e validação nativa em [VALIDACAO.md](../VALIDACAO.md).

## Contexto

O usuário solicitou implementar o aplicativo pessoal Android. As propostas anteriores precisavam ser concretizadas em bibliotecas, armazenamento e integrações. O ambiente oferece Node 22, SDK Android 36 e NDK 27.1.

## Decisão

- Adotar Expo SDK 54, React Native 0.81 e TypeScript para aproveitar o ambiente Android disponível. Fixar as dependências pelo lockfile e registrar manutenção de dependências no relatório de validação.
- Separar domínio, integrações, persistência, estado e telas em src/. Não criar backend ou conta de usuário nesta versão.
- Persistir um snapshot JSON validado e versionado usando AsyncStorage. Serializar gravações para preservar a ordem e suspender gravação se o carregamento falhar.
- Usar SecureStore para a chave Gemini no Android; manter a chave apenas em memória na versão web. Não embutir credenciais nem incluí-las em backup.
- Usar Photon para resolução explícita de endereço e Overpass para descoberta, com endpoints configuráveis. O servidor público testado aceitou GET; usar saída body/center para preservar coordenadas de nós e centros de áreas.
- Limitar consulta Overpass a 1.500 elementos e 30 segundos no servidor, além do timeout no cliente. A consulta usa caixas geográficas indexadas, com filtro circular exato no cliente antes da seleção; a memória solicitada é limitada a 64 MiB. Selecionar até a quantidade configurada entre candidatos disponíveis, sem promessa de cobertura completa.
- Consultar apenas a página oficial indicada para enriquecimento, verificando robots.txt e limitando conteúdo. Resolver fotografias somente por referências Wikimedia Commons específicas e licenças suportadas.
- Integrar Gemini por REST e selecionar um modelo retornado pela chave pessoal, sem impor um modelo que possa ter sido descontinuado. IA começa desabilitada; o usuário configura chave, modelo e cotas.
- Gerar PDF nativo com Expo Print e compartilhar com Expo Sharing. No navegador, abrir exclusivamente o HTML comercial em uma janela própria de impressão.
- Incluir backup da carteira como extensão local: importação adiciona IDs novos e preserva dados e ajustes atuais. Sem sincronização automática ou módulo de tarefas.

## Alternativas consideradas

SQLite seria adequado para consultas maiores e migrações complexas, mas não é necessário para a carteira inicial de uma pessoa. Um backend agregaria hospedagem e gestão de segredos; não foi necessário para a primeira integração Android. Google Places não foi adotado por suas condições de uso e objetivo de custo. SDKs mais novos exigiriam revalidar ferramentas nativas e bibliotecas; não atualizar uma versão isolada de React Native fora da compatibilidade do Expo.

## Consequências

Web serve como prévia e suporte à validação, mas não substitui o APK. CORS pode impedir consulta a sites no navegador. A chave pessoal usa proteção do sistema; isso não transforma um aplicativo cliente em cofre de credenciais de uma organização. Cotas do plano gratuito e disponibilidade dos servidores precisam ser acompanhadas. O app não detecta se uma chave Gemini pertence a projeto faturado.

Não há avaliações do Google nesta versão. Falta de imagens, contato ou informação não será preenchida com dados inventados. Consultas de enriquecimento com falha mantêm dados da descoberta e são contadas na indicação de cobertura.

## Funcionalidades e código relacionados

- [F001](../features/F001-identidade-e-navegacao.md)
- [F002](../features/F002-localizacao-e-raio.md)
- [F003](../features/F003-descoberta-e-selecao.md)
- [F004](../features/F004-enriquecimento-e-evidencias.md)
- [F005](../features/F005-imagens-e-atribuicoes.md)
- [F006](../features/F006-analise-inicial-ia.md)
- [F008](../features/F008-analise-detalhada-e-cobranca.md)
- [F009](../features/F009-pdf-e-compartilhamento.md)
- [F010](../features/F010-carteira-status-e-notas.md)
- [F011](../features/F011-rota-google-maps.md)
- [F012](../features/F012-contato-whatsapp.md)
- [F013](../features/F013-persistencia-e-offline.md)
- [F014](../features/F014-backup-e-restauracao.md)
- [F015](../features/F015-configuracoes-cotas-e-custos.md)
- [F016](../features/F016-android-e-distribuicao.md)
- Código central: [estado](../../src/state/usePescaLead.ts), [persistência](../../src/storage/repository.ts), [descoberta](../../src/integrations/discovery.ts) e [dispositivo](../../src/integrations/device.ts).

## Validação e revisão

Testes de regras e interface cobrem os fluxos implementados. A consulta real pequena confirmou resolução de endereço e retorno de estabelecimentos com coordenadas. Isso não garante cobertura da cidade do usuário. Validar chamadas reais de IA com a chave pessoal e funções nativas em aparelho.

Reavaliar armazenamento quando houver maior volume ou consultas complexas; reavaliar backend se surgirem equipe, sincronização ou credenciais compartilhadas.

## Histórico

| Data | Decisão | Origem |
| --- | --- | --- |
| 2026-11-17 | Escolhas propostas concretizadas neste ADR; registros anteriores preservados e substituídos. | Solicitação do usuário para implementar o projeto. |
| 2026-11-17 | Consulta espacial ajustada para caixas indexadas com filtragem circular no cliente após timeout da consulta ampla; timeout do cliente inclui espera na fila do servidor. | Teste real de 10 km em região densa. |
