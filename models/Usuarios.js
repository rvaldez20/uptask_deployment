const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

// importamos bcrypt para hashear el password
const bcrypt = require('bcrypt-nodejs');

// creamos el modelo Usuarios
const Usuarios = db.define('usuarios', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   email:{
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
         isEmail: {
            msg: 'Agrega un Correo Valido'
         },
         notEmpty: {
            msg: 'El e-mail no puede ir vacio'
         }
      },
      unique: {
         args: true,
         msg: 'Usuario ya registrado'
      }
   },
   password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
         notEmpty: {
            msg: 'El Password no puede ir vacio'
         }
      }
   },
   activo: {
      type: Sequelize.INTEGER,
      defaultValue: 0
   },
   token: {
      type: Sequelize.STRING
   },
   expiracion: {
      type: Sequelize.DATE
   },
},{
   hooks: {
      beforeCreate(usuario){
         // console.log('Creando nuevo usuario');
         // console.log(usuario);
         usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
      }
   }
});

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
/* -------------------- Metodos personalizados  */

Usuarios.prototype.verificarPassword = function(password) {
   return bcrypt.compareSync(password, this.password);
}


/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

// establecemos la referencia
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;



// ++++++ allowNull: false es para que no pueda ir vacio 
// ++++++ allowNull: false pueda ir vacio