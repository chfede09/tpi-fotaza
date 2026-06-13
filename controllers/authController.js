const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

// 1. Renderizo formulario de Registro
exports.renderRegister = (req, res) => {
    res.render('register', { title: 'Registro de Usuario' });
};

// 2. Renderizo formulario de Login
exports.renderLogin = (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
};

// 3. Registro de un nuevo usuario
exports.handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    // Validación en el backend
    if (!username || !email || !password) {
        return res.render('register', { error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Encriptar la contraseña con bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardo el usuario
        await Usuario.crear(username, email, hashedPassword);

        // Si esta todo bien, lo mandamos al login
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

// 4. Inicio de Sesión
exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'Por favor, complete todos los campos.' });
    }

    try {
        // Buscar al usuario por email 
        const usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            return res.render('login', { error: 'Credenciales inválidas.' });
        }

        // Verificamos si la cuenta fue inactivada por el validador
        if (!usuario.activo) {
            return res.render('login', { error: 'Esta cuenta ha sido desactivada por infringir las normas de la comunidad.' });
        }

        // Comparo la contraseña ingresada con el hash guardado en la base de datos
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.render('login', { error: 'Credenciales inválidas.' });
        }

        // Guardar los datos clave en la sesión del servidor 
        req.session.userId = usuario.id;
        req.session.username = usuario.username;
        req.session.role = usuario.role;

        // Redirecciono al Home principal de la app
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// 5. Proceso el Cierre de Sesión
exports.handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
        }
        res.redirect('/auth/login');
    });
};