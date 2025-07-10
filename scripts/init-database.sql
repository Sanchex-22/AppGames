-- Crear base de datos SQLite para Club de Interés Compuesto

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

-- Insertar datos iniciales

-- Usuarios por defecto
INSERT OR IGNORE INTO users (username, password, is_admin, is_super_admin, created_at) VALUES
('admin', 'superder!!2', TRUE, TRUE, CURRENT_TIMESTAMP),
('jose', 'clave1', FALSE, FALSE, CURRENT_TIMESTAMP),
('maria', 'clave2', FALSE, FALSE, CURRENT_TIMESTAMP);

-- Ideas de negocio predeterminadas
INSERT OR IGNORE INTO business_ideas (idea_text, created_by) VALUES
('Vende café o empanadas', 1),
('Revende cargadores o accesorios', 1),
('Haz trabajos rápidos por encargo', 1),
('Ofrece clases o tutorías', 1),
('Vende productos por catálogo', 1),
('Crea diseños o currículums', 1),
('Revende ropa usada o reacondicionada', 1);

-- Frases motivacionales predeterminadas
INSERT OR IGNORE INTO motivational_quotes (quote_text, created_by) VALUES
('El éxito es la suma de pequeños esfuerzos repetidos cada día.', 1),
('No te detengas, estás más cerca de lo que crees.', 1),
('Todo logro empieza con la decisión de intentarlo.', 1),
('Cuando sientas que vas a rendirte, recuerda por qué empezaste.', 1),
('La disciplina es el puente entre metas y logros.', 1),
('Cada día es una nueva oportunidad para crecer.', 1),
('Los pequeños pasos diarios llevan a grandes cambios.', 1),
('Tu futuro se crea por lo que haces hoy, no mañana.', 1),
('El dinero que no arriesgas, no puede multiplicarse.', 1),
('La paciencia y la perseverancia tienen un efecto mágico.', 1);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_rounds_progress_id ON progress_rounds(progress_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_user_shared_ideas_author_id ON user_shared_ideas(author_id);
CREATE INDEX IF NOT EXISTS idx_idea_likes_idea_id ON idea_likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
