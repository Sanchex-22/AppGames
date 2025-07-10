// Script para resetear la base de datos
const fs = require("fs")
const path = require("path")

const dbPath = path.join(process.cwd(), "data", "club_interes_compuesto.db")

console.log("🗑️  Reseteando base de datos...")

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
  console.log("✅ Base de datos anterior eliminada")
}

// Ejecutar inicialización
console.log("🔄 Reinicializando...")
require("./init-db.js")
