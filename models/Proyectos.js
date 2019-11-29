// importamos sequelize y el modulo de la db
const Sequelize = require('sequelize');
const db = require('../config/db');

// importamos la libreria externas slug y shorid
const slug = require('slug');
const shortid = require('shortid');

// definimos el modelo Proyectos
// 'proyectos' es el nombre d ela tabla en la db
const Proyectos = db.define('proyectos', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   nombre: {
      type: Sequelize.STRING(100),      
   },
   url: {
      type: Sequelize.STRING(100)
   }
}, {
   hooks: {
      beforeCreate(proyecto) {
         // cramos la URL sera el nombre con guines medio y minusculas
         const url = slug(proyecto.nombre).toLowerCase();

         proyecto.url = `${url}-${shortid.generate()}`;
      }
   }
});

// Esportamos la definicipon del modelo Proyectos
module.exports = Proyectos;

