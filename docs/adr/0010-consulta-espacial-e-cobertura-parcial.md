# ADR-0010 — Consulta espacial e cobertura parcial explícita

- Estado: Aceita.
- Data: implementação iniciada em 2026-11-17.
- Responsável: Codex, na implementação autorizada pelo usuário.
- Complementa: [ADR-0007](0007-implementacao-expo-local.md).

## Contexto

Uma consulta pequena real retornou estabelecimentos. A consulta completa de 10 km em São Paulo encontrou timeout/HTTP 502 na instância pública; outra instância também não respondeu no prazo. Gratuidade e uso de servidores públicos exigem tratamento de indisponibilidade e cobertura honesta.

## Decisão

Usar consultas GET com filtros de tipo de negócio antes de nome e caixas geográficas indexadas que circunscrevem o raio. Tratar os limites do globo e polos. Aplicar distância haversine para o círculo exato antes de selecionar candidatos, sem incluir estabelecimentos dos cantos da caixa fora do raio.

Limites amplos: 1.500 elementos de saída, timeout do servidor de 30 segundos, 64 MiB de memória solicitada e timeout de 65 segundos no cliente para incluir espera na fila. Esses limites não garantem que o servidor aceite ou conclua a consulta.

Somente em timeout, erro de conexão ou HTTP 5xx/consulta interrompida sem resultados, tentar **uma única consulta menor**, com amostra central de 1 km e até 250 elementos. Informar progresso e retornar marca de cobertura parcial com a distância efetivamente consultada. Filtrar os resultados dessa amostra em 1 km. Nunca apresentar a amostra como busca concluída em 10–50 km.

Não repetir em HTTP 429 ou demais erros 4xx. Não trocar automaticamente de servidor para contornar cotas. Falha da consulta menor retorna erro e preserva a carteira existente. Respostas inválidas não devem ser substituídas por leads fictícios.

## Alternativas consideradas

Aumentar indefinidamente tempo/memória sobrecarregaria um serviço compartilhado. Fazer dezenas de consultas por busca aumentaria custo operacional e carga. Esconder a redução de cobertura produziria um resultado enganoso. Uma fonte hospedada ou paga permanece opção futura, a validar com o usuário conforme a cobertura desejada.

## Consequências

Em sobrecarga, pode haver resultados úteis apenas perto da origem, sem seleção representativa dos 10–50 km. O usuário deve conseguir distinguir essa situação e trocar endereço ou tentar novamente quando a fonte estiver disponível. A seleção inicial continua limitada aos candidatos realmente encontrados.

## Funcionalidades e código relacionados

- [F002](../features/F002-localizacao-e-raio.md)
- [F003](../features/F003-descoberta-e-selecao.md)
- [F015](../features/F015-configuracoes-cotas-e-custos.md)
- [discovery.ts](../../src/integrations/discovery.ts): buildQuery, boundingBoxes e discover.
- [usePescaLead.ts](../../src/state/usePescaLead.ts): progresso e cobertura apresentada.
- [Testes de integração](../../tests/integrations.test.ts): sobrecarga, amostra explícita e ausência de repetição em cota.
- [Teste real opcional](../../integration-live/providers.test.ts) e [relatório](../VALIDACAO.md).

## Validação e revisão

Revisar a estratégia com a cobertura real da cidade do usuário. A disponibilidade do serviço precisa ser separada de testes com respostas controladas. Não considerar uma execução parcial como prova de cobertura ampla.

## Histórico

| Registro | Motivo |
| --- | --- |
| Consulta ampla refinada e amostra menor explicitamente limitada implementada. | Falhas observadas nos testes de serviço real. |
