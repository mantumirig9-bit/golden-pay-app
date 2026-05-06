# Golden Pay APK Build Guide

## Build APK using Android Studio

1. Install Node.js LTS and Android Studio.
2. Open this project folder in terminal.
3. Run:

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

4. Android Studio will open.
5. Go to: Build > Build Bundle(s) / APK(s) > Build APK(s)
6. APK will be created inside:

```bash
android/app/build/outputs/apk/debug/app-debug.apk
```

## App details

- App name: Golden Pay
- Package ID: com.goldenpay.app
- Web folder: dist
- UPI deep link support is already inside the app.
