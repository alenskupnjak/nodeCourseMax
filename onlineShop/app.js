'use strict';
const dotenv = require('dotenv')
const fs = require('fs');
const morgan = require('morgan')
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { err404 } = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect

// Load env vars
dotenv.config({ path: './config/config.env' });


// ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


// // za kreiranje logova u   R0000
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   { flags: 'a' }
// );

// kreiranje express aplikaciju
const app = express();

// definiramo template engine koji cemo koristiti u aplikaciji (EJS ili PUG ili express-handlebars)
// app.set('view engine', 'pug'); // za pug
app.set('view engine', 'ejs'); // za ejs
// kreiramo stazu odakle cemo vuci template
app.set('views', path.join(__dirname, 'views'));

// body -parser, bez ovoga ne salje podatke automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

// definiranje statičkih tranica za HTML ....
app.use(express.static(path.join(__dirname, 'public')));

// prikazi logove 
// app.use(morgan('combined', { stream: accessLogStream }));


// Rute
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// zadnji middelware koji lovi sve
app.use('*', err404);

mongoConnect(() => {  
  app.listen(process.env.port || 3000,() => {
    console.log(`App listening on port ${process.env.PORT}`.blue);
    console.log(process.env.NODE_ENV.yellow);
  });
});