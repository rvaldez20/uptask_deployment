import Swal from 'sweetalert2';
import axios from 'axios';
import { actualizarAvance } from '../funciones/avance';

// exportamos la funció  actualizar avance de funcione/avance.js


const tareas = document.querySelector('.listado-pendientes');

// validamos que exista tareas
if (tareas){
   // ecuchamos el evento click en el icono actualizar estado
   tareas.addEventListener('click', e => {
      // console.log(e.target.classList);
      if (e.target.classList.contains('fa-check-circle')){
         const icono =  e.target;
         const idTarea = icono.parentElement.parentElement.dataset.tarea;
         //console.log(idTarea);

         // hacemos un request hacia /tareas/:id, usamos location.origin
         const url = `${location.origin}/tareas/${idTarea}`;
         // console.log(url);

         // hacemos la petición axios.patch a la url cre creamos y mandamos el idTarea
         axios.patch(url, { idTarea })
            .then(function(respuesta){
               if(respuesta.status === 200){
                  icono.classList.toggle('completo');

                  // actualizamos la barra del avance del proyecto
                  actualizarAvance();
               }
               console.log(respuesta);
            })

         // actualizamos el avance del proyecto   
         
      }

      // campuramos el evento click en el icono eleiminar (trash)
      if (e.target.classList.contains('fa-trash-alt')) {
         // console.log('Eliminando...');
         // console.log(e.target);

         const tareaHTML = e.target.parentElement.parentElement;
         const idTarea = tareaHTML.dataset.tarea;

         // console.log(tareaHTML);
         // console.log(idTarea);

         Swal.fire({
            title: 'Deseas eliminar esta Tarea?',
            text: "Una Tarea eliminada no se puede recuperar!!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, cancelar'
         }).then((result) => {
            if (result.value) {
               console.log('Eliminando...');

               // creamos la url /tareas/:id, usamos location.origin
               const url = `${location.origin}/tareas/${idTarea}`;

               // hacemos la petición axios con . delete
               axios.delete(url, { params: { idTarea } })
                  .then(function(respuesta){
                     if(respuesta.status === 200){
                        // eliminamos el nodo del html de la tarea que se elimino
                        tareaHTML.parentElement.removeChild(tareaHTML);

                        //opcional una alerta
                        // ventana que muestra mensaje que el proyecto ha sido eliminado
                        Swal.fire(
                           'Tarea Eliminada!',
                           respuesta.data,
                           'success'
                        );

                        // actualizamos la barra del avance del proyecto
                        actualizarAvance()

                        console.log(respuesta);
                     }

                     console.log(respuesta);
                  });
            }
         })

      } // cierre if (e.target.classList.contains('fa-trash-alt'))
   }) // cierre tareas.addEventListener
} // cierre if tareas

export default tareas;
