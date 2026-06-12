const Publicacion = require('../models/publicacionModel');
const Comentario = require('../models/comentarioModel');

// 1. Mostrar el Feed principal con todas las fotos e hilos de comentarios
exports.mostrarFeed = async (req, res) => {
    try {
        const publicaciones = await Publicacion.obtenerTodas();
        
        // Buscamos los comentarios para cada una de las publicaciones
        for (let post of publicaciones) {
            post.comentarios = await Comentario.obtenerPorPublicacion(post.id);
        }

        return res.render('feed', {
            title: 'Feed Principal - Fotaza',
            publicaciones: publicaciones
        });
    } catch (error) {
        console.error('Error al cargar el feed:', error);
        if (!res.headersSent) {
            return res.status(500).send('Error interno del servidor');
        }
    }
};
    
// 2. Procesar el envío del formulario de comentarios
exports.agregarComentario = async (req, res) => {
    try {
        const { contenido, publicacion_id } = req.body;
        const usuario_id = req.session.userId;

        if (!usuario_id) {
            return res.redirect('/auth/login');
        }

        await Comentario.crear(contenido, publicacion_id, usuario_id);
        return res.redirect('/publicaciones'); 
    } catch (error) {
        console.error('Error al crear comentario:', error);
        return res.status(500).send('Error al procesar el comentario');
    }
};

// 3. Mostrar el formulario para subir una nueva foto
exports.formularioNuevaPublicacion = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    return res.render('nuevaPublicacion', { title: 'Subir Foto - Fotaza' });
};

// 4. Procesar el envío del formulario de nueva publicación
exports.handleNuevaPublicacion = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    const { titulo, descripcion, imagen_url } = req.body;

    try {
        await Publicacion.crear({
            titulo,
            descripcion,
            imagen_url,
            usuario_id: req.session.userId
        });
        return res.redirect('/publicaciones');
    } catch (error) {
        console.error(error);
        return res.render('nuevaPublicacion', { 
            title: 'Subir Foto - Fotaza', 
            error: 'Hubo un problema al guardar la publicación. Intentalo de nuevo.' 
        });
    }
};

// 5. Mostrar la pantalla de "Mis Fotos" (Galería Personal)
exports.mostrarMisFotos = async (req, res) => {
    try {
        const usuario_id = req.session.userId;
        if (!usuario_id) {
            return res.redirect('/auth/login');
        }

        // Buscamos solo las publicaciones que pertenecen al usuario logueado
        const publicaciones = await Publicacion.obtenerPorUsuario(usuario_id);
        
        // También les cargamos sus respectivos comentarios
        for (let post of publicaciones) {
            post.comentarios = await Comentario.obtenerPorPublicacion(post.id);
        }

        return res.render('misFotos', {
            title: 'Mis Fotos - Fotaza',
            publicaciones: publicaciones
        });
    } catch (error) {
        console.error('Error al cargar Mis Fotos:', error);
        return res.status(500).send('Error interno del servidor');
    }
};

// 6. Procesar el borrado de una publicación
exports.eliminarPublicacion = async (req, res) => {
    try {
        const { id } = req.params; 
        const usuario_id = req.session.userId;

        if (!usuario_id) {
            return res.redirect('/auth/login');
        }

        await Publicacion.eliminar(id, usuario_id);
        return res.redirect('/publicaciones/mis-fotos');
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        return res.status(500).send('Error al eliminar la publicación');
    }
};