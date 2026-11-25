# Emulador Android do PescaLead

## Diagnóstico e correção

Em 2026-11-18, a criação real de uma VM KVM retornou EBUSY (errno 16). A máquina Windows11 estava ativa no VirtualBox. O comando emulator -accel-check dizia que KVM estava instalado e utilizável, mas isso não garantia disponibilidade para criar outra VM.

O script [emulator.mjs](../scripts/emulator.mjs) verifica KVM_CREATE_VM antes de iniciar, confirma uma imagem Android completa e usa somente o AVD PescaLead_Test. O perfil foi reduzido para 720 × 1280, GPU SwiftShader, sem câmera/áudio e sem snapshots. O modo de software usa uma CPU para reduzir sobrecarga. Nenhum comando salva, pausa ou desliga máquinas do VirtualBox automaticamente.

## Uso

```bash
npm run emulator:doctor
npm run emulator
npm run emulator:verify
```

O primeiro comando é diagnóstico. O segundo inicia com KVM e só declara pronto quando sys.boot_completed=1 e os serviços package e activity existem. O terceiro instala o APK do projeto, abre o app, confirma renderização React Native e testa navegação básica. Não limpa a carteira nem envia mensagens.

Para rodar sem janela: `npm run emulator -- --headless`. Para encerrar somente o AVD do projeto: `npm run emulator:stop`.

Para uma tentativa de software explícita: `npm run emulator -- --software --headless`. Esse modo é lento e não equivale a corrigir um conflito de aceleração. O timeout padrão é 240 s com KVM e 900 s em software; PESCALEAD_BOOT_TIMEOUT_SECONDS pode ajustar esse limite.

## Windows11 no VirtualBox

Se Windows11 estiver em execução e houver conflito, salvar seu estado libera a virtualização preservando a sessão. Isso suspende temporariamente o uso do Windows e exige autorização do usuário antes de executar VBoxManage controlvm Windows11 savestate. O script de emulador não faz isso.

Depois de encerrar o Android, a sessão salva pode ser retomada no VirtualBox. Não descarregar módulos do kernel ou desligar máquinas à força para resolver esse conflito.

## SDK e dados

O SDK de teste completo fica em .cache/test-sdk e o AVD em .cache/avd. A imagem é system-images;android-35;default;x86_64. O script também aceita PESCALEAD_TEST_SDK apontando para outro SDK completo. O SDK principal anterior continha metadados de uma imagem sem system.img, por isso o diretório isolado foi preparado.

O arquivo config.ini.before-emulator-fix preserva a configuração anterior. Dados do AVD não são apagados. A porta padrão é 5580; PESCALEAD_EMULATOR_PORT aceita portas pares livres entre 5554 e 5682. O comando stop verifica o nome do AVD para evitar encerrar outra máquina.

Logs, screenshot, XML e resultado de validação ficam em artifacts/emulator. Ver o estado final no [relatório de validação](VALIDACAO.md).

## Referência

A documentação Android descreve limitações de coexistência entre tecnologias de virtualização: [aceleração do emulador](https://developer.android.com/studio/run/emulator-acceleration).
