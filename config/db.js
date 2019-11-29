// importamos Sequelize
const Sequelize = require('sequelize');
// importar valores de variable.env
require('dotenv').config({path:'variables.env'});

// Parametros de conección de la base de datos
const db = new Sequelize(
   process.env.BD_NOMBRE, 
   process.env.BD_USER, 
   process.env.BD_PASS, 
   {
      host: process.env.BD_HOST,
      dialect: 'mysql',
      port: process.env.BD_PORT,
      define: {
         timestamps: false
      },
      pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
      }
   }
);

// exportamos el objeto d elos parametros de conexion
module.exports = db;