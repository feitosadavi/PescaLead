# PescaLead

Aplicativo pessoal de prospecção local em React Native para Android. Busca estabelecimentos em até 50 km, organiza oportunidades e carteira, sugere soluções, calcula cobrança e compartilha propostas em PDF.

## Executar

Requer Node.js 22.21.1 ou superior (Node 22 LTS recomendado).

```bash
npm ci
npm start
```

Para visualizar as telas no navegador: `npm run web`. O Android é o alvo de uso: alguns sites bloqueiam consultas feitas por navegadores, e GPS, arquivos e compartilhamento têm comportamentos específicos da plataforma.

## Gerar o APK

Requer JDK 17 ou 21, Android SDK com API 36, Build Tools 36.0.0 e NDK 27.1.12297006. Configure `ANDROID_HOME` se necessário.

```bash
npm run build:apk
```

O resultado fica em `artifacts/PescaLead-1.0.1.apk`, com JavaScript incorporado e sem depender do Metro para abrir. Por padrão, o build inclui a arquitetura arm64-v8a. Consulte [a documentação de build](docs/build-android.md) para assinatura e outras arquiteturas.

## Primeira utilização

1. Em Ajustes, informe sua identificação comercial, custo por hora, margem e quantidade desejada de resultados.
2. No Sonar, digite e confirme um endereço ou use o GPS. Escolha de 10 a 50 km e lance a busca.
3. Abra uma oportunidade para revisar dados, fontes, hipóteses e prioridade. Salve-a na carteira e acompanhe status e notas.
4. Na aba Proposta do lead, revise escopo, preços e condições; salve e compartilhe o PDF.
5. Para análises por IA, configure sua própria chave Gemini, consulte e selecione um modelo e habilite a integração em Ajustes. A chave não é fornecida nem embutida no projeto.

Sem IA configurada, sugestões locais são identificadas como hipóteses. A IA utiliza evidências públicas e não recebe notas privadas ou histórico do CRM. O aplicativo não verifica a modalidade de cobrança do seu projeto Gemini: use o plano e as cotas que deseja autorizar. Há limite diário local configurável e nenhuma repetição automática de chamadas com falha.

## Fontes e limites

- Photon resolve endereços e Overpass consulta dados do OpenStreetMap. Serviços e endpoints podem ser substituídos em Ajustes.
- Em timeout/sobrecarga, há uma única tentativa menor em amostra central de 1 km, identificada como parcial; isso não representa a região inteira de 10–50 km. Cotas não são repetidas.
- O ranking considera apenas candidatos encontrados: não representa todos os negócios da área ou probabilidade de venda.
- Consultas de site verificam robots.txt e usam título e descrição públicos, com limites de tamanho e tempo. Restrições ou falhas preservam os dados já encontrados.
- Fotografias dependem de referência específica ao arquivo Wikimedia Commons e licença compatível. Sem foto disponível, o app mostra uma ilustração identificada.
- A fonte inicial não fornece avaliações do Google. Não há coleta ou armazenamento de dados do Google Places.
- Dados locais permanecem entre sessões; a carteira e as notas funcionam sem conexão. Busca, enriquecimento e IA exigem internet.
- Backup permite exportar a carteira e importar novos identificadores sem sobrescrever leads existentes ou ajustes. Credenciais não são incluídas.

## Verificar

```bash
npm run check
npm run export:web
npm run test:e2e
```

Os testes de interface usam dados explicitamente fictícios e controlados. Nenhum lead de demonstração é incluído no app.

Teste opcional das fontes reais, sem chave ou serviço pago:

```bash
npm run test:providers
```

O endereço público padrão de teste é Avenida Paulista, São Paulo. Para outro endereço, use `PESCALEAD_TEST_ADDRESS`. Esse teste pequeno não garante cobertura de toda a região ou disponibilidade futura dos serviços.

## Contexto e rastreabilidade

- [Contexto e escopo](CONTEXT.MD)
- [Mapa das funcionalidades e código](docs/FEATURES.md)
- [Decisões de arquitetura](docs/adr/README.md)
- [Manutenção da documentação](docs/README.md)
- [Validação e limitações](docs/VALIDACAO.md)
