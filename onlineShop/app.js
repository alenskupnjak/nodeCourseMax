'use strict';
const dotenv = require('dotenv');
const fs = require('fs');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { err404 } = require('./controllers/errorCtrl');
// izvedba bez mongoose
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/userModel');

// Load env vars
dotenv.config({ path: './config/config.env' });

// ROUTES
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const authRoutes = require('./routes/authRouter');

// // za kreiranje logova u   R0000
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   { flags: 'a' }
// );

// START! Kreiranje express aplikacije!
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

// verzija mongoDB
app.use((req, res, next) => {
  User.findById('5f3d0577469cb830c0bbf38c')
    .then((user) => {
      // definiran user koji se provlaci kroz cijelu aplikaciju
      req.podaci = [
        ' app.js definirana je  app.js-req.user = new User(user.name, user.email, user.cart, user._id);',
      ];

      // definicija user-a za daljnji radu u programu
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Rute
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('/', authRoutes);

// zadnji middelware koji lovi sve
app.use('*', err404);

// spajanje na databazu

mongoose
  .connect(process.env.SHOP_DATABASE_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    // gledamo ima li ijedan zapis u bazi
    User.findOne().then((user) => {
      if (!user) {
        console.log(
          'Kreiramo za potrebe razvijanja programa novog korisnika ako ne postoji'
        );
        const user = new User({
          name: 'Alen',
          email: 'alen@test.com',
          cart: { items: [] },
        });
        // snimamo usera
        user.save();
      }
    });

    app.listen(5500, () => {
      console.log('App listening on port 5500!');
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Izvedba bez mongoose
// mongoConnect(() => {
//   app.listen(process.env.port || 3000, () => {
//     console.log(`App listening on port ${process.env.PORT}`.blue);
//     console.log(process.env.NODE_ENV.yellow);
//   });
// });
