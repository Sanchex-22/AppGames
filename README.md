# Proyecto Next.js + Capacitor + Android

Este proyecto es una aplicación móvil construida con **Next.js** y **Capacitor**, generada como APK para Android.

---

## 🚀 **Requisitos**

- Node.js (v16 o v18 recomendado)
- npm
- Capacitor
- Android Studio (para emulador o generar APK)
- JDK 21 (Temurin o AdoptOpenJDK)
- Git

---

## ⚙️ **Instalación**

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

## Instala dependencias:

npm install


## Configurar capacitor *(si es la primera vez):

npx cap init
npx cap add android


## ejecucion web
npm run dev
Accede en tu navegador en http://localhost:3000


## ejecucion android
1.Genera el build web exportable: npm run build
2.Sincroniza con Capacitor: npx cap sync android
3.Corre en un emulador o dispositivo físico: npx cap run android

## 📦 Generar APK
Ve al directorio Android: cd android

Compila APK debug:

./gradlew assembleDebug

El APK se generará en:

android/app/build/outputs/apk/debug/app-debug.apk
# AppGames
