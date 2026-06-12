const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

// 1. Renderizar formulario de Registro
exports.renderRegister = (req, res) => {
    res.render('register', { title: 'Registro de Usuario' });
};

// 2. Renderizar formulario de Login
exports.renderLogin = (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
};

// 3. Procesar el Registro de un nuevo usuario
exports.handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    // Validación básica en el backend
    if (!username || !email || !password) {
        return res.render('register', { error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Encriptar la contraseña de forma segura con bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar el usuario usando nuestro Modelo
        await Usuario.crear(username, email, hashedPassword);

        // Si sale todo bien, lo mandamos al login
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        // Manejo del error en caso de que el username o email ya existan (campos UNIQUE en MySQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.render('register', { error: 'El nombre de usuario o el email ya están en uso.' });
        }
        res.status(500).send('Error interno del servidor');
    }
};

// 4. Procesar el Inicio de Sesión
exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'Por favor, complete todos los campos.' });
    }

    try {
        // Buscar al usuario por email usando el Modelo
        const usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            return res.render('login', { error: 'Credenciales inválidas.' });
        }

        // Verificar si la cuenta fue inactivada por el validador (Requisito del TPI)
        if (!usuario.activo) {
            return res.render('login', { error: 'Esta cuenta ha sido desactivada por infringir las normas de la comunidad.' });
        }

        // Comparar la contraseña ingresada con el hash guardado en la base de datos
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.render('login', { error: 'Credenciales inválidas.' });
        }

        // Guardar los datos clave en la sesión del servidor (express-session)
        req.session.userId = usuario.id;
        req.session.username = usuario.username;
        req.session.role = usuario.role;

        // Redireccionar al Home principal de la app
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// 5. Procesar el Cierre de Sesión
exports.handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
        }
        res.redirect('/auth/login');
    });
};