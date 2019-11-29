import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

// validamos que btnEliminar exista
if(btnEliminar){
   btnEliminar.addEventListener('click', (e) => {

      const urlProyecto = e.target.dataset.proyectoUrl;
      // console.log(urlProyecto);

      
      // implementamos sweetalert2
      Swal.fire({
         title: 'Deseas eliminar este Proyecto?',
         text: "Un proyecto eliminado no se puede recuperar!!",
         type: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Si, Eliminar!',
         cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.value) {

               // creamos la url a la que se le hara la peticion
               const url = `${location.origin}/proyectos/${urlProyecto}`;
               
               // hacemos la petición a axios
               axios.delete(url, { params: {urlProyecto} })
                  .then(function(respuesta) {
                     console.log(respuesta);
                     
                     // ventana que muestra mensaje que el proyecto ha sido eliminado
                     Swal.fire(
                        'Proyecto Eliminado!',
                         respuesta.data,                        
                        'success'
                     );
         
                     //redireccionar al inicio
                     setTimeout(() => {
                        window.location.href = '/'
                     }, 2000);                     
                  })
                  .catch(() => {
                     Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar el Proyecto'
                     })
                  })                                         
            }
      })
   })
}

export default btnEliminar;