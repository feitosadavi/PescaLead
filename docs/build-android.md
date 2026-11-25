# Build Android do PescaLead

## Ambiente

- Node.js >=22.21.1; desenvolvimento verificado com Node 22.21.1.
- JDK 17 ou 21.
- SDK Android API 36, Build Tools 36.0.0 e NDK 27.1.12297006.
- Gradle 8.14.3 pelo wrapper gerado pelo Expo.
- Dependências JavaScript reproduzíveis pelo package-lock.json.

## Comando

```bash
npm ci
npm run build:apk
```

O script [build-android.sh](../scripts/build-android.sh) gera o projeto nativo quando necessário, compila a variante release e copia o APK para `artifacts/PescaLead-1.0.1.apk`. Caches e projeto nativo são gerados localmente e não versionados; o código de configuração do app é [app.config.ts](../app.config.ts).

Por padrão inclui arm64-v8a. Para gerar também a versão x86_64 usada por alguns emuladores:

```bash
PESCALEAD_ABIS=arm64-v8a,x86_64 npm run build:apk
```

Se já houver uma distribuição Gradle adequada instalada, defina `PESCALEAD_GRADLE_BIN` para evitar baixá-la novamente. `GRADLE_USER_HOME` usa `.cache/gradle` do projeto por padrão. O acesso à rede é necessário para baixar dependências na primeira execução.

## Assinatura e instalação

O script prepara uma assinatura pessoal com [configure-signing.mjs](../scripts/configure-signing.mjs), gerando a chave e sua credencial no diretório privado `.signing/`, ignorado pelo Git. A senha chega ao Gradle por variável de ambiente e não é embutida no código. Guarde uma cópia segura desse diretório para produzir atualizações com a mesma assinatura. Não é necessário conta Expo ou publicação. A prévia de desenvolvimento do Expo usa assinatura de depuração; o APK de entrega gerado pelo script usa a assinatura pessoal.

Instale o arquivo no seu aparelho autorizando a instalação a partir da fonte escolhida. Para desenvolvedores com dispositivo conectado e depuração habilitada: `adb install -r artifacts/PescaLead-1.0.1.apk`.

Identificador Android: `com.pescalead.app`. Versão atual: 1.0.1, versionCode 2, Android mínimo API 24. Builds futuros destinados a atualização devem aumentar o versionCode e preservar assinatura.

## O que o build não comprova

Compilar e verificar o pacote não substitui testar GPS, WhatsApp, Google Maps, compartilhamento e armazenamento seguro no aparelho. A matriz de verificações e os resultados efetivamente obtidos estão em [VALIDACAO.md](VALIDACAO.md).
