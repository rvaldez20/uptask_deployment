
// importamos eñl modelo
const Proyectos = require('../models/Proyectos'); 
const Tareas = require('../models/Tareas');


// ++++++ Controlador para el home (ProyectosHome)
exports.proyectosHome = async (req, res) => {

   // console.log(res.locals.usuario);

   // obtenemos el id del usuario autenticado
   const usuarioId = res.locals.usuario.id;

   // para mostrar todos los proyectos pero filtrados con el Id del usuario autenticado
   const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId }});

   res.render('index', {
      nombrePagina: 'Proyectos ',
      proyectos
   });
}



exports.formularioProyecto = async (req, res) => {
   
   // obtenemos el id del usuario autenticado
   const usuarioId = res.locals.usuario.id;
   
   // para mostrar todos los proyectos pero filtrados con el Id del usuario autenticado
   const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId }});

   res.render('nuevoProyecto', {
      nombrePagina: "Nuevo Proyecto",
      proyectos
   })
}



// se convierte el metodo a async - await
exports.nuevoProyecto = async (req, res) => {
   
   // obtenemos el id del usuario autenticado
   const usuarioId = res.locals.usuario.id;
   
   // para mostrar todos los proyectos pero filtrados con el Id del usuario autenticado
   const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId }});


   //res.send('Enviaste el formulario')
   // enviar a la consola lo que el usuario escriba
   //console.log(req.body);

   // obtenemos los valores del formulario usando destructuring
   const { nombre } = req.body;
   
   // ++++++ Se hace la validadción 
   let errores = [];

   if(!nombre){
      errores.push({'texto': 'Agrega un Nombre al Proyecto'});
   }

   // Si hay errores
   if(errores.length > 0 ){
      res.render('nuevoProyecto', {
         nombrePagina: 'Nuevo Proyecto',
         errores,
         proyectos
      })
   } else {
      // si no hay errores entonces insertamos en la base de datos
      const usuarioId = res.locals.usuario.id;
      const proyecto = await Proyectos.create({ nombre, usuarioId });
      res.redirect('/');      
   }
}  // fin nuevo proyecto



exports.proyectoPorUrl = async (req, res, next) => {
   // obtenemos el id del usuario autenticado
   const usuarioId = res.locals.usuario.id;
   // para mostrar todos los proyectos pero filtrados con el Id del usuario autenticado
   const proyectosPromise = Proyectos.findAll({ where: { usuarioId: usuarioId }});


   // para acceder a ese valor de url d etoda la ruta
   // res.send(req.params.url);

   // hacemos una consulat a la db
   const proyectoPromise =  Proyectos.findOne({
      where: {
         url: req.params.url,
         usuarioId: usuarioId
      }
   });

   const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise]);
   


   // consultar tareas del proyecto actual
   const tareas = await Tareas.findAll({
      where: {
         proyectoId: proyecto.id
      },
      include: [
         { model: Proyectos }
      ]
   });
   // pasamos las tareas a la vista en el objeto del .render
   // console.log(tareas);

   if(!proyecto) return next();
   
   // console.log(proyecto);
   // res.send('OK');

   res.render('tareas', {
      nombrePagina: 'Tareas del Proyecto',
      proyecto,
      proyectos,
      tareas
   })
} //fin proyectoporUrl proyecto 


exports.formularioEditar = async (req, res) => {
   // obtenemos el id del usuario autenticado
   const usuarioId = res.locals.usuario.id;
   
   // para mostrar todos los proyectos pero filtrados con el Id del usuario autenticado
   const proyectosPromise = Proyectos.findAll({ where: { usuarioId: usuarioId }});


   // buscamos el proyecto por el id que obtenemos de la url
   const proyectoPromise = Proyectos.findOne({
      where: {
         id: req.params.id,
         usuarioId: usuarioId
      }
   });

   // se meten las consultas en un array de promises y se otiene por medio de array destructuring
   const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise]);

   res.render('nuevoProyecto', {
      nombrePagina: 'Editar Proyecto',
      proyectos,
      proyecto
   })
} //fin editar proyecto 


exports.actualizarProyecto = async (req, res) => {
   
   // obtenemos el id del usuario autenticado
   const usuarioId = res.locals.usuario.id;
   
   // para mostrar todos los proyectos pero filtrados con el Id del usuario autenticado
   const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId }});
   

   //res.send('Enviaste el formulario')
   // enviar a la consola lo que el usuario escriba
   //console.log(req.body);

   // obtenemos los valores del formulario usando destructuring
   const { nombre } = req.body;
   
   // ++++++ Se hace la validadción 
   let errores = [];

   if(!nombre){
      errores.push({'texto': 'Agrega un Nombre al Proyecto'});
   }

   // Si hay errores
   if(errores.length > 0 ){
      res.render('nuevoProyecto', {
         nombrePagina: 'Nuevo Proyecto',
         errores,
         proyectos
      })
   } else {
      // si no hay errores entonces insertamos en la base de datos
      await Proyectos.update(
         { nombre: nombre },
         { where: { id: req.params.id }}
      );
      res.redirect('/');      
   }
}  // fin actualizar proyecto 

exports.eliminarProyecto = async (req, res, next) => {

   // req, puede ser con query o params
   // console.log(req.query);

   const {urlProyecto} = req.query;

   //para eliminar el registro seleccionado el destroy viene siendo el DELETE
   const resultado = await Proyectos.destroy({
      where: {
         url: urlProyecto
      }
   });

   // validamos que realmente existe un resultado
   if(!resultado){
      return next();
   }

   res.status(200).send('Proyecto Eliminado Correctamente !!');
}