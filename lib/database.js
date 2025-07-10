// Configuración de la base de datos SQLite
const Database = require("better-sqlite3")
const path = require("path")
const fs = require("fs")

const dbPath = path.join(process.cwd(), "data", "club_interes_compuesto.db")

// Crear directorio de datos si no existe
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Inicializar base de datos
const db = new Database(dbPath)

// Configurar WAL mode para mejor concurrencia
db.pragma("journal_mode = WAL")
db.pragma("synchronous = NORMAL")
db.pragma("cache_size = 1000")
db.pragma("temp_store = memory")

// Funciones para usuarios
const userQueries = {
  // Obtener usuario por username
  getByUsername: db.prepare(`
    SELECT * FROM users WHERE username = ?
  `),

  // Crear nuevo usuario
  create: db.prepare(`
    INSERT INTO users (username, password, is_admin, email, full_name)
    VALUES (?, ?, ?, ?, ?)
  `),

  // Actualizar último login
  updateLastLogin: db.prepare(`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
  `),

  // Obtener todos los usuarios
  getAll: db.prepare(`
    SELECT id, username, is_admin, is_super_admin, created_at, last_login, email, full_name
    FROM users ORDER BY created_at DESC
  `),

  // Eliminar usuario
  delete: db.prepare(`
    DELETE FROM users WHERE id = ? AND is_super_admin = FALSE
  `),
}

// Funciones para ideas de negocio
const businessIdeaQueries = {
  // Obtener todas las ideas activas
  getAll: db.prepare(`
    SELECT * FROM business_ideas WHERE is_active = TRUE ORDER BY id
  `),

  // Crear nueva idea
  create: db.prepare(`
    INSERT INTO business_ideas (idea_text, created_by) VALUES (?, ?)
  `),

  // Actualizar idea
  update: db.prepare(`
    UPDATE business_ideas SET idea_text = ? WHERE id = ?
  `),

  // Eliminar idea (soft delete)
  delete: db.prepare(`
    UPDATE business_ideas SET is_active = FALSE WHERE id = ?
  `),
}

// Funciones para ideas compartidas por usuarios
const userIdeaQueries = {
  // Obtener todas las ideas con información del autor y likes
  getAllWithDetails: db.prepare(`
    SELECT 
      usi.*,
      u.username as author_name,
      COUNT(il.id) as likes_count,
      GROUP_CONCAT(ul.username) as liked_by_users
    FROM user_shared_ideas usi
    JOIN users u ON usi.author_id = u.id
    LEFT JOIN idea_likes il ON usi.id = il.idea_id
    LEFT JOIN users ul ON il.user_id = ul.id
    WHERE usi.is_active = TRUE
    GROUP BY usi.id
    ORDER BY usi.created_at DESC
  `),

  // Crear nueva idea compartida
  create: db.prepare(`
    INSERT INTO user_shared_ideas (idea_text, author_id, category) VALUES (?, ?, ?)
  `),

  // Eliminar idea compartida
  delete: db.prepare(`
    UPDATE user_shared_ideas SET is_active = FALSE WHERE id = ?
  `),

  // Verificar si usuario ya dio like
  checkLike: db.prepare(`
    SELECT id FROM idea_likes WHERE idea_id = ? AND user_id = ?
  `),

  // Agregar like
  addLike: db.prepare(`
    INSERT INTO idea_likes (idea_id, user_id) VALUES (?, ?)
  `),

  // Quitar like
  removeLike: db.prepare(`
    DELETE FROM idea_likes WHERE idea_id = ? AND user_id = ?
  `),
}

// Funciones para frases motivacionales
const quoteQueries = {
  // Obtener todas las frases activas
  getAll: db.prepare(`
    SELECT * FROM motivational_quotes WHERE is_active = TRUE ORDER BY id
  `),

  // Crear nueva frase
  create: db.prepare(`
    INSERT INTO motivational_quotes (quote_text, author, created_by) VALUES (?, ?, ?)
  `),

  // Actualizar frase
  update: db.prepare(`
    UPDATE motivational_quotes SET quote_text = ?, author = ? WHERE id = ?
  `),

  // Eliminar frase (soft delete)
  delete: db.prepare(`
    UPDATE motivational_quotes SET is_active = FALSE WHERE id = ?
  `),
}

// Funciones para progreso de usuarios
const progressQueries = {
  // Obtener progreso activo del usuario
  getActiveByUserId: db.prepare(`
    SELECT * FROM user_progress WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC LIMIT 1
  `),

  // Crear nuevo progreso
  create: db.prepare(`
    INSERT INTO user_progress (user_id, capital, percentage, rounds) VALUES (?, ?, ?, ?)
  `),

  // Actualizar progreso
  update: db.prepare(`
    UPDATE user_progress SET capital = ?, percentage = ?, rounds = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

  // Desactivar progreso anterior
  deactivatePrevious: db.prepare(`
    UPDATE user_progress SET is_active = FALSE WHERE user_id = ? AND id != ?
  `),
}

// Funciones para rondas de progreso
const roundQueries = {
  // Obtener rondas por progreso ID
  getByProgressId: db.prepare(`
    SELECT * FROM progress_rounds WHERE progress_id = ? ORDER BY round_number
  `),

  // Crear nueva ronda
  create: db.prepare(`
    INSERT INTO progress_rounds (progress_id, round_number, goal_amount, missing_amount, suggested_idea)
    VALUES (?, ?, ?, ?, ?)
  `),

  // Actualizar ronda
  update: db.prepare(`
    UPDATE progress_rounds 
    SET current_amount = ?, missing_amount = ?, is_completed = ?, completed_at = ?
    WHERE id = ?
  `),

  // Eliminar rondas por progreso ID
  deleteByProgressId: db.prepare(`
    DELETE FROM progress_rounds WHERE progress_id = ?
  `),
}

// Funciones para mensajes del chat
const chatQueries = {
  // Obtener mensajes recientes
  getRecent: db.prepare(`
    SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 100
  `),

  // Crear nuevo mensaje
  create: db.prepare(`
    INSERT INTO chat_messages (user_id, username, message, message_type) VALUES (?, ?, ?, ?)
  `),

  // Limpiar mensajes antiguos (mantener solo los últimos 1000)
  cleanup: db.prepare(`
    DELETE FROM chat_messages WHERE id NOT IN (
      SELECT id FROM chat_messages ORDER BY created_at DESC LIMIT 1000
    )
  `),
}

// Funciones para sesiones activas
const sessionQueries = {
  // Obtener usuarios en línea
  getOnlineUsers: db.prepare(`
    SELECT username FROM active_sessions 
    WHERE last_activity > datetime('now', '-5 minutes')
    ORDER BY username
  `),

  // Agregar/actualizar sesión
  upsertSession: db.prepare(`
    INSERT INTO active_sessions (user_id, username, last_activity)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      last_activity = CURRENT_TIMESTAMP
  `),

  // Remover sesión
  removeSession: db.prepare(`
    DELETE FROM active_sessions WHERE user_id = ?
  `),

  // Limpiar sesiones inactivas
  cleanupInactive: db.prepare(`
    DELETE FROM active_sessions WHERE last_activity < datetime('now', '-5 minutes')
  `),
}

// Transacciones útiles
const transactions = {
  // Crear progreso completo con rondas
  createProgressWithRounds: db.transaction((userId, capital, percentage, rounds, roundsData) => {
    // Desactivar progreso anterior
    progressQueries.deactivatePrevious.run(userId, 0)

    // Crear nuevo progreso
    const progressResult = progressQueries.create.run(userId, capital, percentage, rounds)
    const progressId = progressResult.lastInsertRowid

    // Crear rondas
    roundsData.forEach((round) => {
      roundQueries.create.run(progressId, round.round, round.goal, round.missing, round.idea)
    })

    return progressId
  }),

  // Toggle like en idea
  toggleIdeaLike: db.transaction((ideaId, userId) => {
    const existingLike = userIdeaQueries.checkLike.get(ideaId, userId)

    if (existingLike) {
      userIdeaQueries.removeLike.run(ideaId, userId)
      return false // Like removido
    } else {
      userIdeaQueries.addLike.run(ideaId, userId)
      return true // Like agregado
    }
  }),
}

module.exports = {
  db,
  userQueries,
  businessIdeaQueries,
  userIdeaQueries,
  quoteQueries,
  progressQueries,
  roundQueries,
  chatQueries,
  sessionQueries,
  transactions,
}
