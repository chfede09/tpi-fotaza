-- 1. Crear la base de datos 
DROP DATABASE IF EXISTS fotaza_db;
CREATE DATABASE fotaza_db;
USE fotaza_db;

-- 2. Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('anonimo', 'registrado', 'validador') DEFAULT 'registrado',
    publicaciones_bajadas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

-- 3. Tabla de Publicaciones
CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_autor INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    comentarios_abiertos BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. Tabla de Recursos (Imágenes y Videos)
CREATE TABLE recursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_publicacion INT NOT NULL,
    tipo ENUM('imagen', 'video') NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    licencia ENUM('copyright', 'sin_copyright') NOT NULL,
    marca_agua_texto VARCHAR(100) NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id) ON DELETE CASCADE
);

-- 5. Tabla de Comentarios
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_publicacion INT NOT NULL,
    id_autor INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 6. Tabla de Denuncias 
CREATE TABLE denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_denunciante INT NOT NULL,
    tipo_objeto ENUM('publicacion', 'comentario') NOT NULL,
    id_objeto INT NOT NULL, -- Guardará el ID de la publicación o del comentario correspondiente
    motivo VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_denunciante) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 7. Tabla de Valoraciones 
CREATE TABLE valoraciones (
    id_usuario INT NOT NULL,
    id_publicacion INT NOT NULL,
    puntaje INT NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
    PRIMARY KEY (id_usuario, id_publicacion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id) ON DELETE CASCADE
);

-- 8. Tabla de Seguidores 
CREATE TABLE seguidores (
    id_seguidor INT NOT NULL,
    id_seguido INT NOT NULL,
    PRIMARY KEY (id_seguidor, id_seguido),
    FOREIGN KEY (id_seguidor) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_seguido) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_no_autoseguimiento CHECK (id_seguidor <> id_seguido) -- Evita seguirse a sí mismo
);

-- 9. Tabla de Notificaciones
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_destino INT NOT NULL,
    id_usuario_origen INT NOT NULL,
    tipo_evento ENUM('comentario', 'valoracion', 'interes', 'follow') NOT NULL,
    id_referencia INT NOT NULL, -- ID del post/comentario que disparó el evento
    leida BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_destino) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_origen) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 10. Tabla de Colecciones / Carpetas de Favoritos
CREATE TABLE colecciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 11. Tabla Intermedia Colección-Publicación (Muchos a Muchos)
CREATE TABLE coleccion_publicacion (
    id_coleccion INT NOT NULL,
    id_publicacion INT NOT NULL,
    PRIMARY KEY (id_coleccion, id_publicacion),
    FOREIGN KEY (id_coleccion) REFERENCES colecciones(id) ON DELETE CASCADE,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id) ON DELETE CASCADE
);