const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
    // Configuración adaptada para soportar conexiones seguras locales (XAMPP) y remotas (Aiven)
    const connectionConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD, // Arreglado: Antes decía DB_PASS
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306 // Agregado: Soporta puertos dinámicos
    };

    // Si detecta que nos conectamos a Aiven (remoto), le activa el SSL obligatorio
    if (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')) {
        connectionConfig.ssl = {
            rejectUnauthorized: false
        };
    }

    // Conexión al servidor MySQL
    const connection = await mysql.createConnection(connectionConfig);

    console.log('Conectado al servidor MySQL...');

    try {
        // Lee el archivo SQL desde la raíz del proyecto
        const sqlPath = path.join(__dirname, '../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Quitar comentarios multilinea (/* ... */) y de una sola linea (-- o #)
        let cleanSql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
        cleanSql = cleanSql.replace(/(--|#).*$/gm, '');

        // Separamos las consultas individuales
        const queries = cleanSql
            .split(';')
            .map(query => query.trim())
            .filter(query => query.length > 0);

        console.log('Creando base de datos y estructuras de tablas...');
        
        for (const query of queries) {
            await connection.query(query);
        }

        console.log('¡Base de datos e integridad de tablas inicializadas con éxito en la nube!');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    } finally {
        await connection.end();
        process.exit();
    }
}

initDatabase();