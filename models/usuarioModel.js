const db = require('../config/db');

// Defino el objeto contenedor
const Usuario = {};

// 1. Realizo un método para buscar por email
Usuario.buscarPorEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
};

// 2. Realizo un método para crear 
Usuario.crear = async (datosOUsername, email, passwordHash) => {
    let username, mail, pass;

    if (typeof datosOUsername === 'object' && datosOUsername !== null) {
        username = datosOUsername.username;
        mail = datosOUsername.email;
        pass = datosOUsername.password || datosOUsername.passwordHash;
    } else {
        username = datosOUsername;
        mail = email;
        pass = passwordHash;
    }

    const [result] = await db.query(
        'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, "registrado")',
        [username, mail, pass]
    );
    return result.insertId;
};

// 3. Exportacion 
module.exports = Usuario;