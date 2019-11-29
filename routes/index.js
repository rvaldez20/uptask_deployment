
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
/* -------------------- Routes del Proyecto  */
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

// ++++++ requires
const express = require('express');

// ++++++ Instanciamos el Router()
const router = express.Router();

// ++++++ Importamos express Validator
const { check } = require('express-validator');

// ++++++ Importamos el Controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
/* -------------------- RUTAS: Proyectos */
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

module.exports = function() {

   // +++++ ruta principal
   router.get('/', 
      authController.usuarioAutenticado,
      proyectosController.proyectosHome
   );


   // ++++++ ruta para nuevo proyecto (muestra el formulario)
   router.get('/nuevo-proyecto', 
      authController.usuarioAutenticado,
      proyectosController.formularioProyecto
   );


   // ++++++ ruta para enviar los datos del formulario del nuevo proyecto
   router.post('/nuevo-proyecto', 
      authController.usuarioAutenticado,
      [check('nombre').not().isEmpty().trim().escape()],
      proyectosController.nuevoProyecto
   );


   // ++++++ ruta para listar el proyecto seleccionado usamos el comodin :url
   router.get('/proyectos/:url', 
      authController.usuarioAutenticado,
      proyectosController.proyectoPorUrl
   );


   // ++++++ ruta para editar (actualizar) el nombre del proyecto -Muestra el formulario
   router.get('/proyecto/editar/:id',
      authController.usuarioAutenticado,
      proyectosController.formularioEditar
   );

   // ++++++ ruta para guardar el nombre del proyecto (Actualizarlo) - Enviar el formulario
   router.post('/nuevo-proyecto/:id', 
      authController.usuarioAutenticado,
      [check('nombre').not().isEmpty().trim().escape()],
      proyectosController.actualizarProyecto
   );

   // ++++++ ruta para eliminar un proyecto (se hace por medio de axios)
   router.delete('/proyectos/:url',
      authController.usuarioAutenticado,
      proyectosController.eliminarProyecto
   );


   /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
   /* -------------------- RUTAS: Tareas  */
   /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
   
   // ++++++ ruta para agregar una tarea (enviar los datos del formulario)
   router.post('/proyectos/:url', 
      authController.usuarioAutenticado,
      tareasController.agregarTarea
   );

   // ++++++ ruta para actualizar una tarea (cambia el estado a 0 o 1) 
   // NO es una ruta visible, solo interna para catuañlizar el estado
   router.patch('/tareas/:id',
      authController.usuarioAutenticado,
      tareasController.cambiarEstadoTarea
   );

   // ++++++ ruta para eliminar tarea por medio del id
   router.delete('/tareas/:id',
      authController.usuarioAutenticado,
      tareasController.eliminarTarea
   ); 


   /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
   /* -------------------- RUTAS: cuestas y usuarios  */
   /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

   // ++++++ ruta get patra crear nueva cuenta (formulario para crear la cuenta)
   // ++++++ ruta post para recibir los datos para crear cuenta
   router.get('/crear-cuenta', usuariosController.formCrearCuenta);
   router.post('/crear-cuenta', usuariosController.crearCuenta);
   router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

   // ++++++ ruta get para mostrat formulario de iniciar sesion
   // ++++++ ruta post pra enviar los datos del formulario de iniciar sesion
   router.get('/iniciar-sesion', usuariosController.formIniciarSesion); 
   router.post('/iniciar-sesion', authController.autenticarUsuario);

   // ++++++ Para cerrar la sesión
   router.get('/cerrar-sesion', authController.cerrarSesion);

    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
   /* -------------------- RUTAS: restablecer la contraseña  */
   /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

   // ++++++ Restablecer password formulario 
   router.get('/reestablecer', usuariosController.formRestablecerPassword);

   // ++++++ Enviar el formulario para reestablecer el password
   router.post('/reestablecer', authController.enviarToken);
   
   // ++++++ para reestablecer la contraseña con el token en la Url muetra el form para resetear password
   router.get('/reestablecer/:token', authController.validarToken);

   // ++++++ Para enviar la nueva contraseña 
   router.post('/reestablecer/:token', authController.actualizarPassword);



   return router;
}

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
