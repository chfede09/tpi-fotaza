const db = require('../config/db');

const Comentario = {};

// 1. Obtener los comentarios de una publicación específica
Comentario.obtenerPorPublicacion = async (publicacionId) => {
    const sql = `
        SELECT c.*, u.username 
        FROM comentarios c
        INNER JOIN usuarios u ON c.id_autor = u.id
        WHERE c.id_publicacion = ?
        ORDER BY c.fecha_creacion ASC
    `;
    const [rows] = await db.query(sql, [publicacionId]);
    return rows;
};

// 2. Insertar un nuevo comentario en la base de datos
Comentario.crear = async (texto, publicacionId, usuarioId) => {
    const sql = 'INSERT INTO comentarios (contenido, id_publicacion, id_autor) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [texto, publicacionId, usuarioId]);
    return result.insertId;
};

module.exports = Comentario;