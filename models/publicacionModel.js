const db = require('../config/db');

const Publicacion = {};

// Obtengo todas las publicaciones
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

// Creo una publicación
Publicacion.crear = async (datos) => {
    const { titulo, descripcion, imagen_url, usuario_id, fecha_creacion } = datos;
    
    let sql, params;
    if (fecha_creacion) {
        sql = 'INSERT INTO publicaciones (titulo, descripcion, url_imagen, id_autor, fecha_creacion) VALUES (?, ?, ?, ?, ?)';
        params = [titulo, descripcion, imagen_url, usuario_id, fecha_creacion];
    } else {
        sql = 'INSERT INTO publicaciones (titulo, descripcion, url_imagen, id_autor) VALUES (?, ?, ?, ?)';
        params = [titulo, descripcion, imagen_url, usuario_id];
    }
    
    const [result] = await db.query(sql, params);
    return result.insertId;
};

//  Obtengo solo las publicaciones de un usuario específico
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

// Elimino una publicación de la base de datos
Publicacion.eliminar = async (idPublicacion, idAutor) => {
    // Agrego id_autor en el WHERE por seguridad
    const sql = 'DELETE FROM publicaciones WHERE id = ? AND id_autor = ?';
    const [result] = await db.query(sql, [idPublicacion, idAutor]);
    return result.affectedRows > 0;
};

module.exports = Publicacion;