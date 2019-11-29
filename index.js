
// ++++++ Requires
const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// importar valores de variable.env
require('dotenv').config({path:'variables.env'});

// ++++++ Helpers

  const helpers = require('./helpers');

// ++++++ Helpers



/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
/* -------------------- Conexion con la DB  */

// importamos los parametros de la db
const db = require('./config/db');

// importamos los modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// Si solo nos quermeos conectar usamos .authenticate() pero para que este creando estructura se usa .sync()
db.sync()
  .then(() => console.log('Conectado a Server de la DB'))
  .catch((error) => console.log(error));

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */


// ++++++ Instanciamos el servidor en express() en app
const app = express();

// ++++++ Especificamos donde cargar los archivos estaticos
app.use(express.static('./public'));

// ++++++ Habilitamos el Template Engine pug
app.set('view engine', 'pug');

// ++++++ Habilitar el bodyParser para leer datos dle formulario
app.use(bodyParser.urlencoded({extended: true}));

// ++++++ Agregamos express validator a toda la aplicacion 
// app.use(expressValidator());



// ++++++ configuramos el directorio de las views mediante el path
app.set('views', path.join(__dirname, './views'));

// ++++++ agregar flash messages
app.use(flash());

// Agregamos el cookieParser para las cookies d ela sesion
app.use(cookieParser());

// ++++++ sesisones permiten navgar entre distintas paginas si volevrnos a autenticar
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}));

// ++++++ Configiuramos passport para la autenticacion
app.use(passport.initialize());
app.use(passport.session());

// ++++++ Pasra vardump a la aplicacion
app.use((req, res, next) => {
  // para visualizar en consola los datos del usuario que se loguoe
  // console.log(req.user);  
  res.locals.vardump = helpers.vd;
  res.locals.mensajes = req.flash();
  res.locals.usuario = {...req.user} || null;
  // console.log(res.locals.usuario);
  next();
})

// ++++++ Middleware para obtener el año de forma dinamica: year
app.use((req, res, next) => {
  const fecha =  new Date()
  // middeleware que pasa la variable global year
  res.locals.year = fecha.getFullYear();
  next();
})

// ++++++ Para poder utilizar las rutas que hayamos definido en el routes
app.use('/', routes());

// servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, ()=> {
  console.log('El servidor esta funcionando');
});


// ararncamos el servidor  ****NATES DEPLOY
// app.listen(3000,() => {
//    console.log('Server on port 3000');
// });

// ++++++ llamamos para el email  - es para hacer pruebas pero se deja comentado
// require('./handlers/email');