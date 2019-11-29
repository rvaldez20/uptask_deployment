const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// ++++++ Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// localstrategy- Loguin con credenciales propias (usuario y password)
passport.use(
   new LocalStrategy(
      // por default passport espera un usuario y password
      {
         // se especifican los nombre a como lo tienes definido en el modelo 
         usernameField: 'email',
         passwordField: 'password'
      },
      async(email, password, done) => {
         try {
            const usuario = await Usuarios.findOne({
               where: { 
                  email: email,
                  activo: 1
               }
            });
            // El usuario existe, pero password icorrecto
            if(!usuario.verificarPassword(password)){
               return done(null, false, {
                  message: 'Password Incorrecto'
               })            
            }
            //El email es correcto
            return done(null, usuario);
         } catch (error) {
            // Ese usuario no existe
            // no se econtro en la db por lo que ese usuario(email) no existe
            return done(null, false, {
               message: 'Esa cuenta no existe'
            });
         }
      }
   )
);

// como usuario es un ojeto passpor require configurar configuracion adicional
// serializar el usuario
passport.serializeUser((usuario, callback) => {
   callback(null, usuario);
});

// desirializar el usuario
passport.deserializeUser((usuario, callback) => {
   callback(null, usuario);
});

// exportar
module.exports = passport;