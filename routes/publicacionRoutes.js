const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');

// Ruta para ver el feed 
router.get('/', publicacionController.mostrarFeed);

// Rutas para crear publicación 
router.get('/nueva', publicacionController.formularioNuevaPublicacion);
router.post('/nueva', publicacionController.handleNuevaPublicacion);
// Ruta para procesar el envío de un comentario nuevo
router.post('/comentario', publicacionController.agregarComentario);
// Ruta para ver el perfil propio de "Mis Fotos"
router.get('/mis-fotos', publicacionController.mostrarMisFotos);

// Ruta para eliminar una publicación por su ID 
router.post('/eliminar/:id', publicacionController.eliminarPublicacion);
module.exports = router;