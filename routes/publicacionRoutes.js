const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');

// Ruta para ver el feed (pública o privada según decidas, acá la dejamos abierta)
router.get('/', publicacionController.mostrarFeed);

// Rutas para crear publicación (formulario y envío de datos)
router.get('/nueva', publicacionController.formularioNuevaPublicacion);
router.post('/nueva', publicacionController.handleNuevaPublicacion);
// Ruta para procesar el envío de un comentario nuevo
router.post('/comentario', publicacionController.agregarComentario);
// Ruta para ver el perfil propio de "Mis Fotos"
router.get('/mis-fotos', publicacionController.mostrarMisFotos);

// Ruta para eliminar una publicación por su ID (usamos POST para simular el borrado desde un formulario simple)
router.post('/eliminar/:id', publicacionController.eliminarPublicacion);
module.exports = router;