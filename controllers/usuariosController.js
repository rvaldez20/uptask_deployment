// importamos el modelo donde vamos a guardar los datos
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (req,res) => {
   // res.send('Funciona...');
   res.render('crearCuenta', {
      nombrePagina: 'Crear cuenta en Uptask'
   })
}

exports.formIniciarSesion = (req,res) => {
   // res.send('Funciona...');

   // debuguear los errores
   // console.log(res.locals.mensajes);

   const { error } = res.locals.mensajes;

   res.render('iniciarSesion', {
      nombrePagina: 'Inicia Sesión en Uptask',
      error: error
   })
}

exports.crearCuenta = async(req,res) => {
   // res.send('Enviando datos');

   // leer los datos
   // console.log(req.body);
   const { email, password } = req.body;

   try {
      // crear el usuario
      await Usuarios.create({
         email: email,
         password: password
      });

      // crear una URL de confirmar
      const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

      // crear el objeto de usuario 
      const usuario = {
         email
      }

      // enviar el email
      await enviarEmail.enviar({
         usuario,
         subject: 'Confirma tu cuenta de UpTask',
         confirmarUrl,
         archivo: 'confirmar-cuenta'
      });

      // enviar o reedirigir al usuasio
      req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
      res.redirect('/iniciar-sesion');   
   } catch (error) {
      // usamos el paquete connect-flash y com .map los agrupamos en error
      req.flash('error', error.errors.map(error => error.message));

      // console.log(error.message);
      res.render('crearCuenta', {
         // es la forma en que validamos nosotros
         // errores: error.errors,
         mensajes: req.flash(),
         nombrePagina: 'Crear cuenta en Uptask',
         email: email,
         password: password
      })
   }
}

exports.formRestablecerPassword = (req, res) => {
   //mostramos el formulario para restablecer el password
   res.render('reestablecer', {
      nombrePagina: 'Restablecer tu contraseña'
   });
}


// cambia el estado de una cuenta
exports.confirmarCuenta = async(req, res) => {
   // se prueba la ruta que funcione, debe mostra el correo
   // res.json(req.params.correo);

   // hace,mos la consulta y nos traemos al usuario con ese correo
   const usuario = await Usuarios.findOne({
      where: {
         email: req.params.correo
      }
   });

   // si no existe el usuario
   if(!usuario){
      req.flash('error', 'No valido');
      res.redirect('/crear-cuenta');
   }

   // actualiazmos el activo a 1
   usuario.activo =1;
   await usuario.save();

   req.flash('correcto', 'Cuenta Activada correctamente');
   res.redirect('/iniciar-sesion');

}

// exports.resetPassword = async(req, res) => {
//    res.json(req.params.token);
// }