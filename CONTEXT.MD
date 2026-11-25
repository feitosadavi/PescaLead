# PescaLead — contexto do projeto

Atualizado em: 2026-11-17 (America/Sao_Paulo).

Status: primeira versão com código implementado. Build Android e validação de dispositivo registrados em [VALIDACAO.md](docs/VALIDACAO.md).

Este arquivo é a referência principal de contexto e escopo. Consulte o [mapa de funcionalidades](docs/FEATURES.md), o [registro de ADRs](docs/adr/README.md) e as [regras de manutenção da documentação](docs/README.md).

Requisitos confirmados e propostas técnicas são distintos. Escolhas agora implementadas: Expo/TypeScript, AsyncStorage com snapshot validado, Photon/Overpass, integração Gemini opcional, carteira offline, backup e regra de prioridade v1. Veja os ADRs 0007/0008 e os limites da validação. Trechos iniciais que descrevem propostas preservam as premissas do escopo; o estado atual do código está no mapa funcional. O diretório de trabalho ainda se chama ProspectaLead; o nome público do produto é PescaLead.

## 1. Objetivo e público

Aplicativo React Native para Android, entregue como APK para uso pessoal. Encontrar estabelecimentos próximos, identificar oportunidades rentáveis de software e automação, gerar propostas personalizadas e acompanhar o relacionamento comercial.

Priorizar negócios locais com possibilidade de acesso direto ao proprietário. Essa possibilidade deve aparecer como sinal estimado ou informação confirmada pelo usuário; nunca presumir conhecer o responsável.

Padrões iniciais propostos: português do Brasil, valores em reais, distância em linha reta para delimitar a busca e consulta online às fontes externas. Esses padrões são ajustáveis durante o desenvolvimento.

## 2. Identidade visual

- Nome público: PescaLead.
- Tema de pesca aplicado à descoberta de oportunidades: sonar, ondas, anzol e peixe em ilustrações discretas.
- Azul profundo como base, verde-água para ações e coral para destaques, mantendo contraste e legibilidade.
- Proposta de navegação: Sonar (buscar), Oportunidades (resultados), Carteira (leads salvos) e Ajustes.
- Exemplos de ações: “Lançar busca”, “Analisar oportunidade” e “Salvar lead”. Usar termos comerciais claros nos status e documentos.
- Fotos dos estabelecimentos e informações comerciais continuam sendo o foco dos cartões. PDFs terão aparência comercial profissional com a identidade do PescaLead.

## 3. Busca de estabelecimentos

- Origem pela localização do celular, mediante permissão, ou endereço digitado.
- Raios fixos de 10, 20, 30, 40 ou 50 km.
- Quantidade desejada de resultados configurável pelo usuário. Interpretação inicial da resposta “valor ajustado pelo usuário”: quantidade de leads apresentados; preços de propostas também serão editáveis.
- Apresentar uma seleção priorizada, com opção de filtros por segmento, distância, qualidade dos dados e prioridade comercial.
- A seleção representa os melhores candidatos encontrados dentro da cobertura consultada, sem prometer todos os estabelecimentos existentes ou o melhor negócio de toda a região.
- Remover duplicados usando identificadores da fonte e, quando necessário, comparar nome, localização, endereço e telefone sem fundir automaticamente negócios ambíguos.
- Identificar leads já salvos para preservar notas, status e histórico ao repetir uma busca.
- Mostrar progresso, resultados parciais, falhas de fontes e limites atingidos.
- Dimensionar a coleta pelo volume de candidatos e pelas cotas disponíveis; ampliar o raio não deve disparar consultas ilimitadas.

## 4. Dados e estratégia de custo

Prioridade: serviços gratuitos e planos gratuitos, com provedores substituíveis. Nenhuma dependência paga será necessária sem configuração explícita pelo usuário. Quando uma cota acabar, suspender a etapa afetada e informar a limitação.

Estratégia inicial proposta:

1. Descoberta em OpenStreetMap por uma integração Overpass, respeitando licença, atribuição, política e capacidade do servidor escolhido.
2. Enriquecimento a partir de sites oficiais e outras fontes públicas cujo acesso e uso sejam permitidos. Não presumir que conteúdo publicamente acessível permite coleta irrestrita.
3. Provedor de geocodificação escolhido após validar cobertura de endereços e condições de uso. Não depender de um endpoint público sem verificar suas políticas.
4. IA por API com modalidade gratuita disponível, inicialmente avaliando Gemini. Modelo e cotas serão confirmados na implementação; não fixar a arquitetura a um modelo específico.
5. Google Places apenas como integração opcional após validar custo e compatibilidade contratual com armazenamento, exibição e uso na análise. O uso do Google Maps para abrir uma rota é uma funcionalidade separada.

Coletar, quando disponíveis e permitidos: nome, categoria, endereço, coordenadas, contato comercial, site, horários, avaliações, número de avaliações, fotos e sinais de presença digital. Cada informação relevante deve registrar fonte e data de consulta.

Dados ausentes serão identificados como ausentes. Não inventar avaliações, contatos, faturamento, porte, nome do proprietário ou sistemas já utilizados. As fontes abertas podem ter cobertura insuficiente para alguns campos; gratuidade não significa disponibilidade garantida.

Imagens: exibir ou baixar somente quando a fonte e seus termos permitirem, preservando autoria e atribuições exigidas. Quando não houver imagem utilizável, apresentar ilustração temática claramente distinta de uma foto real. Não apresentar uma imagem ilustrativa como foto do estabelecimento.

Consultar informações públicas úteis à análise comercial, evitando coleta indiscriminada de dados pessoais. Notas privadas e histórico comercial não devem ser enviados à IA quando não forem necessários. Considerar as condições de tratamento de dados do plano escolhido.

## 5. Motor de análise e prioridade comercial

Fluxo: descobrir candidatos → normalizar dados → remover duplicados → fazer triagem econômica → aprofundar os candidatos mais promissores → ordenar a seleção.

Análise inicial de cada candidato selecionado:

- Categoria e descrição objetiva do negócio.
- Informações observadas com suas fontes.
- Possíveis necessidades e oportunidades de automação, explicitamente identificadas como hipóteses quando não confirmadas.
- Proposta de solução criada para o estabelecimento, sem catálogo obrigatório.
- Potencial de implantação e recorrência em faixas estimadas.
- Complexidade, esforço de desenvolvimento e manutenção estimados.
- Justificativa da prioridade e qualidade das evidências.
- Perguntas para esclarecer lacunas em uma conversa com o proprietário.

Considerar soluções como gestão, estoque, agendamento, vendas, atendimento, CRM, sites, aplicativos, integrações e automações com IA conforme o caso. Não recomendar funcionalidades apenas para ampliar a proposta: cada uma deve ter problema, benefício e justificativa.

O ranking deve considerar potencial de receita, recorrência, custo de entrega, manutenção, adequação da solução, sinais de demanda e acesso ao decisor. Quando houver avaliações válidas, considerar nota junto ao volume de avaliações; ela será um sinal entre outros, sem equivaler a capacidade de investimento.

Produzir uma pontuação explicável de prioridade comercial. Não apresentar a pontuação como probabilidade estatística de fechamento. Diferenciar atratividade estimada e confiança nos dados; falta de evidência não significa que o negócio é ruim.

Na primeira versão, valores, esforço e viabilidade são estimativas revisáveis. Posteriormente, resultados de propostas ganhas e perdidas poderão ajudar a calibrar o ranking. O usuário poderá corrigir informações e marcar prioridade manual.

## 6. Análise detalhada e proposta de cobrança

Botão sob demanda para gerar uma análise mais completa, aproveitando o que já foi coletado e solicitando informações adicionais quando necessário.

Conteúdo:

- Diagnóstico com fatos e hipóteses separados.
- Solução recomendada e funcionalidades por prioridade.
- Escopo inicial e possíveis evoluções.
- Etapas e faixa estimada de prazo de desenvolvimento.
- Premissas, dependências e limitações.
- Cobrança de implantação e, quando fizer sentido, mensalidade de suporte, hospedagem ou evolução.
- Estimativa dos custos de entrega e manutenção para avaliar margem.
- Condições de pagamento e validade editáveis.
- Perguntas de qualificação pendentes.

O “plano de faturamento” significa proposta de cobrança dos serviços oferecidos pelo usuário. Não exige inferir o faturamento real do estabelecimento.

Permitir configurar custo por hora, margem desejada e parâmetros comerciais para melhorar as estimativas. Enquanto não houver parâmetros suficientes, apresentar faixas e premissas, sem transmitir precisão inexistente. Não prometer receita ou retorno financeiro ao cliente sem base verificável.

O usuário deve poder revisar textos, preços, escopo e identidade do prestador antes de gerar um PDF compartilhável pelo menu nativo do Android. Separar os elementos internos da análise comercial do documento destinado ao cliente.

## 7. Gestão de leads

- Status: Novo → Qualificado → Contatado → Reunião → Proposta → Ganho ou Perdido.
- Permitir mudança manual de status, notas e histórico de alterações.
- Registrar informações descobertas durante a abordagem, propostas emitidas e motivo de perda.
- Filtrar por status, categoria, prioridade e distância.
- Persistir a carteira para reabertura do aplicativo e reutilização em novas buscas.
- Tarefas serão administradas no Trello. A primeira versão não exige módulo de tarefas nem integração com o Trello.

## 8. Ações externas

- “Abrir rota”: abrir o Google Maps para um estabelecimento. Se o app não estiver instalado, tentar a versão web.
- “WhatsApp”: abrir uma conversa pelo número comercial disponível, normalizado. Não afirmar que o número possui WhatsApp antes da verificação. Quando faltar número, explicar a indisponibilidade.
- Não enviar mensagens automaticamente. O usuário decide o conteúdo e confirma o envio no WhatsApp.
- “Compartilhar proposta”: abrir o compartilhamento nativo com o PDF gerado.

## 9. Estrutura técnica proposta

- React Native com TypeScript, avaliando Expo conforme compatibilidade das dependências e do processo de geração do APK.
- Armazenamento local para carteira, notas, configurações e análises que possam ser persistidas conforme a origem dos dados.
- Consultas e análises dependem de internet. Proposta inicial: permitir consultar a carteira salva e editar notas sem conexão.
- Integrações separadas para descoberta, geocodificação, enriquecimento, IA e PDF, facilitando substituição de fornecedores.
- Serviço de apoio mínimo caso necessário para coleta, proteção de credenciais e controle de cotas. Não pressupor que um APK protege segredos embutidos.
- Sem cadastro público, equipes, assinatura ou publicação na Play Store na primeira versão.
- Backup e restauração da carteira em arquivo como recurso proposto para evitar perda dos dados pessoais de prospecção.

## 10. Critérios de aceite da primeira versão

1. Instalar e abrir um APK identificável como PescaLead em um dispositivo Android de teste.
2. Buscar por localização ou endereço com os cinco raios previstos e quantidade de resultados configurável.
3. Apresentar resultados reais com fontes identificadas, tratamento de dados ausentes e remoção de duplicados.
4. Mostrar análise, proposta inicial, pontuação explicada e indicação da confiança nas evidências.
5. Gerar análise detalhada sob demanda com cobrança e funcionalidades editáveis.
6. Gerar e compartilhar um PDF sem notas internas indevidas e com layout legível.
7. Salvar leads, notas, status e histórico, preservando-os ao reabrir o app.
8. Abrir Google Maps e WhatsApp quando os dados necessários estiverem disponíveis.
9. Tratar falta de conexão, permissão negada, cota esgotada e falhas de fornecedores sem simular resultados bem-sucedidos.
10. Respeitar as regras de acesso, atribuição e armazenamento de cada fonte e não habilitar consumo pago implicitamente.

## 11. Pontos para validar durante a implementação

- Cobertura real dos dados gratuitos na cidade de uso: testar uma busca representativa antes de fechar a integração principal.
- Disponibilidade de avaliações e imagens utilizáveis sem custo; não há garantia desses campos para todos os leads.
- Qualidade das recomendações e estimativas: revisar alguns estabelecimentos reais antes de processar lotes maiores.
- Provedores, cotas e necessidade de credenciais individuais.
- Prazo, orçamento de desenvolvimento e dispositivo Android alvo ainda não foram informados; não são promessas desta especificação.

## 12. Referências técnicas consultadas

- Overpass API e instâncias: https://wiki.openstreetmap.org/wiki/Overpass_API
- Google Places Nearby Search: https://developers.google.com/maps/documentation/places/web-service/nearby-search
- Políticas de dados do Google Places: https://developers.google.com/maps/documentation/places/web-service/policies
- Preços e franquias do Google Maps Platform: https://developers.google.com/maps/billing-and-pricing/pricing
- Modalidades de cobrança da API Gemini: https://ai.google.dev/gemini-api/docs/billing/

As condições dos serviços devem ser verificadas novamente ao implementar as integrações.

## 13. Rastreabilidade e manutenção

- Cada funcionalidade tem um identificador estável F001–F016, escopo, critérios de aceite, histórico e mapa de código no [catálogo](docs/FEATURES.md).
- ADRs registram contexto, alternativas, consequências, estado e motivo de revisão. Uma proposta não equivale a uma decisão aceita.
- Código relacionado só receberá um link como implementado quando o arquivo existir e a relação tiver sido verificada. Caminhos planejados são sugestões, sem arquivos ou testes fictícios.
- Toda mudança funcional deve atualizar o documento correspondente e acrescentar uma entrada ao seu histórico. Mudanças de arquitetura devem gerar ou referenciar um ADR.
- A especificação anterior aponta para este contexto para evitar duas versões divergentes do escopo.

## 14. Histórico do contexto

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | Consolidação do nome PescaLead, tema de pesca, raios até 50 km, uso pessoal, propostas personalizadas, PDF, status, notas, Maps e WhatsApp. | Respostas do usuário nesta conversa. |
| 2026-11-17 | Migração da especificação para CONTEXT.MD e criação de catálogo de funcionalidades e ADRs. Separação entre requisitos confirmados e propostas. | Solicitação do usuário nesta conversa. |
| 2026-11-17 | Primeira implementação criada; escolhas concretizadas nos ADRs 0007 e 0008, com links reais por funcionalidade e relatório de validação. | Pedido do usuário para implementar. |

## 15. Entrega da primeira implementação

O APK release foi gerado e assinado, e os documentos funcionais apontam para o código existente. Passaram 43 testes de regras/integrações, 4 fluxos de interface e um teste real do motor de busca. Instalação/abertura em Android e inferência com uma chave real continuam sem validação; o relatório também registra cobertura parcial, falhas da fonte pública e avisos de dependências. Consulte [VALIDACAO.md](docs/VALIDACAO.md) e [README.md](README.md).
