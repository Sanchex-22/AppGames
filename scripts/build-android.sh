#!/bin/bash

echo "🚀 Iniciando construcción para Android..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

echo "🗄️ Inicializando base de datos..."
node scripts/init-db.js

echo "🔨 Construyendo aplicación web..."
npm run build

# Verificar si Capacitor está instalado
if ! command -v npx &> /dev/null; then
    echo "❌ npx no está disponible. Reinstala Node.js"
    exit 1
fi

echo "📱 Configurando Capacitor para Android..."

# Instalar Capacitor si no está instalado
if [ ! -d "node_modules/@capacitor/core" ]; then
    echo "📲 Instalando Capacitor..."
    npm install @capacitor/core @capacitor/cli @capacitor/android
fi

# Inicializar Capacitor si no está configurado
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️ Inicializando Capacitor..."
    npx cap init "Club Interés Compuesto" "com.clubinterescompuesto.app"
fi

# Agregar plataforma Android si no existe
if [ ! -d "android" ]; then
    echo "🤖 Agregando plataforma Android..."
    npx cap add android
fi

echo "🔄 Sincronizando con Capacitor..."
npx cap sync

echo "✅ ¡Construcción completada!"
echo ""
echo "📱 Para continuar:"
echo "1. Abre Android Studio:"
echo "   npx cap open android"
echo ""
echo "2. En Android Studio:"
echo "   - Conecta tu dispositivo Android o inicia un emulador"
echo "   - Haz clic en el botón 'Run' (▶️)"
echo "   - La aplicación se instalará como APK nativa"
echo ""
echo "🎯 Alternativamente, puedes generar un APK:"
echo "   - En Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "🌐 Para desarrollo web:"
echo "   npm start"
