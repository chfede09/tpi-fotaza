const db = require('../config/db');

const Publicacion = {};

// Obtener todas las publicaciones (para el Feed)
Publicacion.obtenerTodas = async () => {
    const sql = `
        SELECT p.*, u.username 
        FROM publicaciones p 
        INNER JOIN usuarios u ON p.id_autor = u.id 
        ORDER BY p.fecha_creacion DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
};

// Crear una publicación
Publicacion.crear = async (datos) => {
    const { titulo, descripcion, imagen_url, usuario_id } = datos;
    const sql = 'INSERT INTO publicaciones (titulo, descripcion, url_imagen, id_autor) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [titulo, descripcion, imagen_url, usuario_id]);
    return result.insertId;
};

// NUEVO: Obtener solo las publicaciones de un usuario específico (para "Mis Fotos")
Publicacion.obtenerPorUsuario = async (usuarioId) => {
    const sql = `
        SELECT p.*, u.username 
        FROM publicaciones p 
        INNER JOIN usuarios u ON p.id_autor = u.id 
        WHERE p.id_autor = ? 
        ORDER BY p.fecha_creacion DESC
    `;
    const [rows] = await db.query(sql, [usuarioId]);
    return rows;
};

// NUEVO: Eliminar una publicación de la base de datos
Publicacion.eliminar = async (idPublicacion, idAutor) => {
    // Agregamos id_autor en el WHERE por seguridad, para que nadie pueda borrar un post ajeno mediante URL
    const sql = 'DELETE FROM publicaciones WHERE id = ? AND id_autor = ?';
    const [result] = await db.query(sql, [idPublicacion, idAutor]);
    return result.affectedRows > 0;
};

module.exports = Publicacion;