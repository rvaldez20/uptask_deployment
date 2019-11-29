import Swal from 'sweetalert2';

export const actualizarAvance = () => {
   // seleccionamos la tareas existentes en base a la clase tarea en cada <li>
   const tareas = document.querySelectorAll('li.tarea');

   if(tareas.length){
      console.log(tareas);
      // seleccionar las tareas completadas
      const tareasCompletas = document.querySelectorAll('i.completo');
   
      // calcular el avance
      const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
   
      // mostrar el avance
      const porcentaje = document.querySelector('#porcentaje');
      porcentaje.style.width = avance+'%';

      if(avance === 100){
         Swal.fire(
            'Proyecto Completado',
            'Felicidades has finalizado todas las tareas del proyecto',
            'success'
         );
      }
   }
}
