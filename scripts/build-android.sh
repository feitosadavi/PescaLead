#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_dir"
export ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}}"
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$project_dir/.cache/gradle}"
export CI=1
mkdir -p artifacts
npx expo prebuild --platform android --no-install
node scripts/configure-signing.mjs
export PESCALEAD_KEYSTORE_FILE="$project_dir/.signing/pescalead.jks"
export PESCALEAD_KEYSTORE_PASSWORD="$(node scripts/configure-signing.mjs --password)"
# A release variant embeds the JavaScript bundle and does not require Metro.
# Preserve .signing for updates; it contains a personal key, never embedded in the source.
if [ -n "${PESCALEAD_GRADLE_BIN:-}" ]; then
  "$PESCALEAD_GRADLE_BIN" -p android :app:assembleRelease -PreactNativeArchitectures="${PESCALEAD_ABIS:-arm64-v8a}" --no-daemon --max-workers=2
else
  (cd android && ./gradlew :app:assembleRelease -PreactNativeArchitectures="${PESCALEAD_ABIS:-arm64-v8a}" --no-daemon --max-workers=2)
fi
app_version="$(node -p 'require("./package.json").version')"
apk_path="artifacts/PescaLead-${app_version}.apk"
cp android/app/build/outputs/apk/release/app-release.apk "$apk_path"
printf '\nAPK criado em %s/%s\n' "$project_dir" "$apk_path"
