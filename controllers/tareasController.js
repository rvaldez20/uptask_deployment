
// importamos el modelo Tareas y el model
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
   // res.send('Enviado');
   // console.log(req.params.url);

   // primero obtenemos el proyecto actual
   const proyecto = await Proyectos.findOne({
      where: {
         url: req.params.url
      }
   });

   // obtenemos el valor del input
   const {tarea} = req.body;

   // estado = 0 incompleto y el ID del proyecto seleccioando
   const estado = 0;
   const proyectoId = proyecto.id;

   // console.log(proyecto);
   // console.log(req.body);

   // insertar en Tareas y redireccionar
   const resultado = await Tareas.create({tarea, estado, proyectoId});

   // validamos que se ejecuto el insert
   if(!resultado){
      return next();
   }

   res.redirect(`/proyectos/${req.params.url}`);
}


exports.cambiarEstadoTarea = async (req, res, next) => {
   // para obtener el id sera con req.params ya que req.query no funciona
   // console.log(req.params);

   // Obtenemos el id de la tarea seleciconada
   const { id } = req.params;

   // buscamos el registro de esa tarea
   const tarea = await Tareas.findOne({
      where: {
         id: id
      }
   });

   // actualizamos el estado de la tarea
   let estado = 0;
   if(tarea.estado === estado) {
      estado = 1;
   }
   tarea.estado = estado;

   // lo guardamos en la db
   const resultado = await tarea.save();

   // si no se puedo actualizar retornamos next()
   if(!resultado) return next();
   // console.log(tarea);

   // enviamos la respuesta que se ha actualizado
   res.status(200).send('Actualizado...');
}


exports.eliminarTarea = async (req, res, next) => {
   // req.paramas retorna { id: '2' }  -> .params retroorna como se especifica el comodin :id
   // req.query retorna { idTarea: '2' } -> query retoorna lo que se especifica en params de axios
   // console.log(req.params);

   const { id } = req.params;
   // console.log(id);

   // Eliminamos la tarea
   const resultado = await Tareas.destroy({
      where: {
         id: id
      }
   });

   // validamos si no se ejecuto el delete
   if(!resultado) return next();

   // si se ejecuto correctamente enviamos la respuesta con estatus 200
   res.status(200).send('La Tarea se a eliminado correctamente');
}
