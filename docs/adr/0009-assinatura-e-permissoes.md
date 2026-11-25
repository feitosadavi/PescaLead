# ADR-0009 — Assinatura pessoal e permissões Android

- Estado: Aceita.
- Data: 2026-11-17.
- Responsável: Codex, na implementação autorizada pelo usuário.
- Complementa: [ADR-0007](0007-implementacao-expo-local.md).

## Contexto

O APK pessoal deve abrir sem Metro, permitir atualizações assinadas pela mesma chave e não solicitar acesso desnecessário ao aparelho.

## Decisão

Gerar variante release com JavaScript incorporado e assinatura pessoal criada localmente. Guardar chave e credencial em `.signing/`, com permissões de arquivo restritas e exclusão do Git. Preparar o projeto nativo a partir da configuração Expo e aplicar a assinatura no script de build. Não versionar segredos nem usar a chave pública de depuração como assinatura da entrega.

Bloquear permissões de microfone, armazenamento externo amplo, sobreposição de telas, biometria e vibração incluídas por dependências mas não utilizadas. Manter internet, localização quando solicitada pelo usuário e a permissão interna de receiver do Android. Usar arquivos internos e seletores/compartilhamento do sistema. SecureStore não exige autenticação biométrica nesta implementação.

Gerar ícone vetorial de pesca pelo plugin de configuração, preservando sua reprodução no prebuild. A entrega validada inclui arm64-v8a e x86_64; o script permite escolher arquiteturas.

## Alternativas consideradas

Assinatura de depuração seria simples, mas não identifica uma chave pessoal. Assinatura hospedada no EAS exigiria uma conta adicional. Permissões de armazenamento amplo não são necessárias para os arquivos privados do app e documentos selecionados explicitamente.

## Consequências

Preservar `.signing/` é necessário para gerar atualizações compatíveis. Perder a chave pode exigir reinstalação e restauração da carteira a partir de backup. O diretório privado não faz parte do backup de leads. Builds para atualização também precisam aumentar o versionCode.

## Funcionalidades e código relacionados

- [F001](../features/F001-identidade-e-navegacao.md): [withBranding.js](../../plugins/withBranding.js).
- [F015](../features/F015-configuracoes-cotas-e-custos.md): [app.config.ts](../../app.config.ts) e [device.ts](../../src/integrations/device.ts).
- [F016](../features/F016-android-e-distribuicao.md): [configure-signing.mjs](../../scripts/configure-signing.mjs) e [build-android.sh](../../scripts/build-android.sh).

## Validação e revisão

apksigner verificou a assinatura pessoal; aapt confirmou nome, versão, arquiteturas e permissões do APK. Os resultados finais e a limitação de teste em dispositivo estão em [VALIDACAO.md](../VALIDACAO.md).

## Histórico

| Data | Registro | Origem |
| --- | --- | --- |
| 2026-11-17 | Assinatura própria, ícone vetorial e manifesto com permissões utilizadas aplicados ao APK. | Implementação e inspeção do pacote Android. |
