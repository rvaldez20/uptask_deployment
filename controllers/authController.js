const passport = require('passport');
const Usuarios = require('../models/Usuarios');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/iniciar-sesion',
   failureFlash: true,
   badRequestMessage: 'Ambos campos son obligatorios'
});

// Funcion para verificar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
   // si el usuario esta autenticado, adelante
   if(req.isAuthenticated()){
      return next();
   }

   // si no esta autenticado, redirigir al formulario de inicio de sesion
   return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesión
exports.cerrarSesion = (req, res) => {
   req.session.destroy( () => {
      res.redirect('/iniciar-sesion');
   })
}

// genera un Token si el usuario es valido
exports.enviarToken = async (req, res) => {
   // verificamos que el email exista en la db
   const {email} = req.body;
   const usuario = await Usuarios.findOne({ 
      where: {
         email: email
      }
   })

   //si no existe el usuario
   if(!usuario) {
      req.flash('error', 'No existe esa cuenta');
      res.render('/reestablecer', {
         nombrePagina: 'Restablecer tu contraseña',
         mensajes:req.flash()
      })
   }

   // usuario existe generamos el tyoken y una expiracion
   // inyectamos esto a la DB usando el objeto usuario que esta relacionado con el modelo
   usuario.token = crypto.randomBytes(20).toString('hex');
   // console.log(token);

   usuario.expiracion = Date.now() + 3600000;
   // console.log(expiracion);

   // Ya solo guardamos el token y la experizacion en la tabal usuario
   await usuario.save();

   // url de reset
   const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
   // console.log(resetUrl);

 
   // Envia el correo con el token
   await enviarEmail.enviar({
      usuario,
      subject: 'Password Reset',
      resetUrl,
      archivo: 'reestablecer-password'
   });

   // redireccionamos despues de enviar el email con el token
   req.flash('correcto', 'Se envio un mensaje a tu correo');
   res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
   // res.json(req.params.token);
   const usuario = await Usuarios.findOne({
      where: {
         token: req.params.token
      }
   });
   // console.log(usuario);
   
   // si no se encuentra el usuario
   if(!usuario){
      req.flash('error', 'Correo invalido');
      res.redirect('/reestablecer');
   }

   // formulario para generar el password
   res.render('resetPassword',{
      nombrePagina: 'Reestablecer Contraseña'
   });
}



// cambia el password por uno nuevo
exports.actualizarPassword = async(req, res) => {
   // console.log(req.params.token);

   // verifica que el token sea valido y tambien la fecha de expiracion
   const usuario = await Usuarios.findOne({
      where: {
         token: req.params.token,
         expiracion: {
            // si la expiración es mayor o igual a la fecha actual
            [Op.gte] : Date.now()
         }
      }
   });
   // console.log(usuario);

   // verificamos si el usuario existe
   if(!usuario) {
      req.flash('error', 'No Valido');
      res.redirect('/reestablecer');
   }

   // hasheamos el nuevo password
   usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

   // limpiamos el token y expiracion que se utilizo
   usuario.token = null;
   usuario.expiracion = null;

   // guardamos el nuevo password
   await usuario.save();

   req.flash('Correcto tu password se ha actualizado correctamente');
   res.redirect('/iniciar-sesion');

}