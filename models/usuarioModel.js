const db = require('../config/db');

// Definimos el objeto contenedor
const Usuario = {};

// 1. Método para buscar por email
Usuario.buscarPorEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
};

// 2. Método para crear (Soporta objetos o parámetros sueltos)
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

// 3. EXPORTACIÓN EXPLÍCITA (Crucial para que el controlador lo vea)
module.exports = Usuario;