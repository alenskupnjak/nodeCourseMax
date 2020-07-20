'use strict';
const dotenv = require('dotenv');
const fs = require('fs');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { err404 } = require('./controllers/errorCtrl');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/userModel');

// Load env vars
dotenv.config({ path: './config/config.env' });

// ROUTES
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');

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

app.use((req, res, next) => {
  User.findById('5f12c65f5b74cabc30ef2bc5')
    .then((user) => {
      // definiran user koj se provlaci kroz cijelu aplikaciju
      req.podaci = [
        ' app.js definirana je  app.js-req.user = new User(user.name, user.email, user.cart, user._id);',
      ];
      req.user = new User(user.name, user.email, user.cart, user._id, user.artikal);
      next();
    })
    .catch((err) => console.log(err));
});


// Rute
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// zadnji middelware koji lovi sve
app.use('*', err404);


mongoConnect(() => {
  app.listen(process.env.port || 3000, () => {
    console.log(`App listening on port ${process.env.PORT}`.blue);
    console.log(process.env.NODE_ENV.yellow);
  });
});
