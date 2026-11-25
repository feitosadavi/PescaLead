const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

module.exports = function withBranding(config) {
  config = withAndroidManifest(config, result => {
    const app = result.modResults.manifest.application[0];
    app.$['android:icon'] = '@drawable/ic_pescalead';
    app.$['android:roundIcon'] = '@drawable/ic_pescalead';
    return result;
  });
  return withDangerousMod(config, ['android', async result => {
    const dir = path.join(result.modRequest.platformProjectRoot, 'app/src/main/res/drawable');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'ic_pescalead.xml'), `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">
 <path android:fillColor="#103F42" android:pathData="M0,0h108v108h-108z"/>
 <path android:strokeColor="#477C70" android:strokeWidth="1.5" android:fillColor="#00000000" android:pathData="M54,13a41,41 0,1 0,0 82a41,41 0,1 0,0 -82M54,24a30,30 0,1 0,0 60a30,30 0,1 0,0 -60"/>
 <path android:fillColor="#D8F2D7" android:pathData="M37,54C48,36 68,38 80,54C68,70 48,72 37,54L26,43L26,65Z"/>
 <path android:fillColor="#103F42" android:pathData="M66,50a3,3 0,1 0,6 0a3,3 0,1 0,-6 0"/>
 <path android:fillColor="#E59B76" android:pathData="M81,25a4,4 0,1 0,8 0a4,4 0,1 0,-8 0"/>
</vector>`);
    return result;
  }]);
};
