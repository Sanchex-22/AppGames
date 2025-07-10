// Script para inicializar la base de datos
const fs = require("fs")
const path = require("path")

console.log("🚀 Iniciando configuración de base de datos...")

// Crear directorio data si no existe
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log("✅ Directorio data/ creado")
}

// Verificar si better-sqlite3 está disponible
try {
  const Database = require("better-sqlite3")

  const dbPath = path.join(dataDir, "club_interes_compuesto.db")
  console.log("📍 Creando base de datos en:", dbPath)

  const db = new Database(dbPath)

  // Configurar base de datos para mejor rendimiento
  db.pragma("journal_mode = WAL")
  db.pragma("synchronous = NORMAL")
  db.pragma("cache_size = 1000")
  db.pragma("temp_store = memory")

  console.log("🗄️  Creando tablas...")

  // Crear todas las tablas necesarias
  db.exec(`
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        is_super_admin BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        email TEXT,
        full_name TEXT
    );

    -- Tabla de ideas de negocio predeterminadas
    CREATE TABLE IF NOT EXISTS business_ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idea_text TEXT NOT NULL,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Tabla de ideas compartidas por usuarios
    CREATE TABLE IF NOT EXISTS user_shared_ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idea_text TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        category TEXT DEFAULT 'general',
        FOREIGN KEY (author_id) REFERENCES users(id)
    );

    -- Tabla de likes en ideas compartidas
    CREATE TABLE IF NOT EXISTS idea_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idea_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, user_id),
        FOREIGN KEY (idea_id) REFERENCES user_shared_ideas(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tabla de frases motivacionales
    CREATE TABLE IF NOT EXISTS motivational_quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_text TEXT NOT NULL,
        author TEXT DEFAULT 'Anónimo',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Tabla de progreso de usuarios
    CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        capital DECIMAL(10,2) NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        rounds INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Tabla de rondas de progreso
    CREATE TABLE IF NOT EXISTS progress_rounds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        progress_id INTEGER NOT NULL,
        round_number INTEGER NOT NULL,
        goal_amount DECIMAL(10,2) NOT NULL,
        current_amount DECIMAL(10,2) DEFAULT 0,
        missing_amount DECIMAL(10,2) NOT NULL,
        suggested_idea TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at DATETIME,
        FOREIGN KEY (progress_id) REFERENCES user_progress(id) ON DELETE CASCADE
    );

    -- Tabla de mensajes del chat
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        message_type TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Tabla de sesiones activas
    CREATE TABLE IF NOT EXISTS active_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Crear índices para mejorar el rendimiento
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_progress_rounds_progress_id ON progress_rounds(progress_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
    CREATE INDEX IF NOT EXISTS idx_user_shared_ideas_author_id ON user_shared_ideas(author_id);
    CREATE INDEX IF NOT EXISTS idx_idea_likes_idea_id ON idea_likes(idea_id);
    CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
  `)

  console.log("👥 Insertando usuarios por defecto...")

  // Insertar usuarios por defecto
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, password, is_admin, is_super_admin) 
    VALUES (?, ?, ?, ?)
  `)

  insertUser.run("admin", "superder!!2", true, true)
  insertUser.run("jose", "clave1", false, false)
  insertUser.run("maria", "clave2", false, false)

  console.log("💡 Insertando ideas de negocio...")

  // Insertar ideas por defecto
  const insertIdea = db.prepare(`
    INSERT OR IGNORE INTO business_ideas (idea_text, created_by) 
    VALUES (?, ?)
  `)

  const ideas = [
    "Vende café o empanadas",
    "Revende cargadores o accesorios",
    "Haz trabajos rápidos por encargo",
    "Ofrece clases o tutorías",
    "Vende productos por catálogo",
    "Crea diseños o currículums",
    "Revende ropa usada o reacondicionada",
  ]

  ideas.forEach((idea) => {
    insertIdea.run(idea, 1)
  })

  console.log("💭 Insertando frases motivacionales...")

  // Insertar frases motivacionales
  const insertQuote = db.prepare(`
    INSERT OR IGNORE INTO motivational_quotes (quote_text, created_by) 
    VALUES (?, ?)
  `)

  const quotes = [
    "El éxito es la suma de pequeños esfuerzos repetidos cada día.",
    "No te detengas, estás más cerca de lo que crees.",
    "Todo logro empieza con la decisión de intentarlo.",
    "Cuando sientas que vas a rendirte, recuerda por qué empezaste.",
    "La disciplina es el puente entre metas y logros.",
    "Cada día es una nueva oportunidad para crecer.",
    "Los pequeños pasos diarios llevan a grandes cambios.",
    "Tu futuro se crea por lo que haces hoy, no mañana.",
    "El interés compuesto es la octava maravilla del mundo.",
    "Invierte en ti mismo, es la mejor inversión que puedes hacer.",
    "Cada peso ahorrado es un paso hacia tu libertad financiera.",
    "Los ricos invierten su dinero y gastan lo que sobra, los pobres gastan su dinero e invierten lo que sobra.",
    "No trabajes por dinero, haz que el dinero trabaje para ti.",
    "La riqueza no se mide por lo que ganas, sino por lo que conservas e inviertes.",
    "Empieza donde estás, usa lo que tienes, haz lo que puedas.",
    "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.",
    "No se trata de cuánto ganas, sino de cuánto guardas y cómo lo haces crecer.",
  ]

  quotes.forEach((quote) => {
    insertQuote.run(quote, 1)
  })

  db.close()
  console.log("✅ ¡Base de datos inicializada correctamente!")
  console.log("📊 Usuarios creados: admin, jose, maria")
  console.log("💡 Ideas de negocio: " + ideas.length + " insertadas")
  console.log("💭 Frases motivacionales: " + quotes.length + " insertadas")
  console.log("🌐 Listo para acceso móvil en red local")
} catch (error) {
  console.error("❌ Error:", error.message)

  if (error.message.includes("better-sqlite3")) {
    console.log("\n🔧 SOLUCIÓN:")
    console.log("1. Instalar better-sqlite3:")
    console.log("   npm install better-sqlite3")
    console.log("\n2. Si falla en Windows:")
    console.log("   npm install --build-from-source better-sqlite3")
    console.log("\n3. Si falla en macOS:")
    console.log("   xcode-select --install")
    console.log("   npm install better-sqlite3")
    console.log("\n4. Si falla en Linux:")
    console.log("   sudo apt-get install build-essential python3")
    console.log("   npm install better-sqlite3")
  }

  process.exit(1)
}
