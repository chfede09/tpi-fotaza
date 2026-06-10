const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
    // Conexión inicial al servidor MySQL local sin base de datos asignada
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    console.log('Conectado al servidor MySQL...');

    try {
        // Lee el archivo SQL desde la raíz del proyecto
        const sqlPath = path.join(__dirname, '../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Separamos las consultas individuales quitando líneas vacías o comentarios
        const queries = sql
            .split(/;\s*$/m)
            .map(query => query.trim())
            .filter(query => query.length > 0 && !query.startsWith('--'));

        console.log('Creando base de datos y estructuras de tablas...');
        
        for (const query of queries) {
            await connection.query(query);
        }

        console.log('¡Base de datos e integridad de tablas inicializadas con éxito en XAMPP!');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    } finally {
        await connection.end();
        process.exit();
    }
}

initDatabase();