// 1. Cargo variables de entorno del archivo .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

// Apunta directo a tus carpetas de la raíz
const authRoutes = require('./routes/authRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes')
const app = express();
const PORT = process.env.PORT || 3000;

// 2.Apunta directo a 'views' en la raíz
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 3. Middlewares para procesar formularios y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 4. Configuración del middleware de Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_para_desarrollo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hora de duración de sesión
}));

// Middleware global 
app.use((req, res, next) => {
    res.locals.usuarioLogueado = req.session.userId || null;
    res.locals.username = req.session.username || null;
    res.locals.role = req.session.role || null;
    next();
});

// 5. Vincular las rutas de autenticación 
app.use('/auth', authRoutes);
app.use('/publicaciones', publicacionRoutes);

// Ruta raíz temporal 
app.get('/', (req, res) => {
    res.redirect('/publicaciones');
});


// 6. Levanta el servidor en el puerto indicado en el .env
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`==================================================`);
});