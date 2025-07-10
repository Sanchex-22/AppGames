#!/bin/bash

echo "🚀 Configurando aplicación móvil..."

# Instalar dependencias de Capacitor
echo "📦 Instalando Capacitor..."
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen

# Inicializar Capacitor
echo "⚡ Inicializando Capacitor..."
npx cap init "Club Interés Compuesto" "com.clubinterescompuesto.app" --web-dir=out

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Agregar plataforma Android
echo "🤖 Agregando plataforma Android..."
npx cap add android

# Sincronizar archivos
echo "🔄 Sincronizando archivos..."
npx cap sync

echo "✅ ¡Configuración completada!"
echo ""
echo "📱 Próximos pasos:"
echo "1. Instala Android Studio: https://developer.android.com/studio"
echo "2. Ejecuta: npm run cap:open"
echo "3. En Android Studio, haz clic en 'Run' para generar la APK"
echo ""
echo "🔧 Comandos útiles:"
echo "- npm run build:mobile  # Construir y abrir en Android Studio"
echo "- npm run cap:sync      # Sincronizar cambios"
echo "- npm run cap:run       # Ejecutar en dispositivo conectado"
