'use strict';
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf')

//https://github.com/expressjs/session
const sessionCart = require('express-session');

// https://www.npmjs.com/package/connect-mongodb-session
const MongoDBStore = require('connect-mongodb-session')(sessionCart);



const { err404 } = require('./controllers/errorCtrl');
const User = require('./models/userModel');

// Usnimavanje env vars
dotenv.config({ path: './config/config.env' });

// ROUTES
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const authRoutes = require('./routes/authRouter');

// START! Kreiranje express aplikacije!
const app = express();

// inicijalizacija za za svaki renderpage, zaštita stranice
const csrfProtection = csrf();

// definiranje session veze u bazi, constructor
let store = new MongoDBStore({
  uri: process.env.SHOP_DATABASE_MONGOOSE,
  collection: 'mojiSessions',
  // By default, sessions expire after 2 weeks. The `expires` option lets
  // you overwrite that by setting the expiration in milliseconds
  // expires: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
});

// definiramo template engine koji cemo koristiti u aplikaciji (EJS ili PUG ili express-handlebars)
// app.set('view engine', 'pug'); // za pug
app.set('view engine', 'ejs'); // za ejs
// kreiramo stazu odakle cemo vuci template
app.set('views', path.join(__dirname, 'views'));

// body -parser, bez ovoga ne salje podatke automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

// definiranje PATH statičkih tranica za HTML ....
app.use(express.static(path.join(__dirname, 'public')));

// SESSION SESSION SESSION SESSION SESSION SESSION
// https://www.npmjs.com/package/express-session
app.use(
  sessionCart({
    secret: process.env.SHOP_DATABASE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// aktivacija zaštite stranice od hakiranja...
app.use(csrfProtection);

// ako smo logirani kreiramo User.model za pozrebe razvoja programa
app.use((req, res, next) => {
  // ako korisnik logiran preskače kreiranje usera
  if (!req.session.user) {
    return next();
  }
  // kreiramo user-a
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// podatci vidljivi za sve VIEWS !!!
app.use((req, res, next) => {
  res.locals.isAutoriziran = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// prikazi logove
// app.use(morgan('combined', { stream: accessLogStream }));

// Rute u programu
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', shopRoutes);

// zadnji middelware koji lovi sve
app.use('*', err404);


// definiranje porta
const PORT = process.env.PORT || 5500;

// console.log(process.env);

// spajanje na databazu
mongoose
  .connect(process.env.SHOP_DATABASE_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
            // // gledamo ima li ijedan zapis u bazi
            // User.findOne().then((user) => {
            //   if (!user) {
            //     console.log(
            //       'Kreiramo za potrebe razvijanja programa novog korisnika ako ne postoji'
            //     );
            //     const user = new User({
            //       name: 'Alen',
            //       email: 'alen@test.com',
            //       cart: { items: [] },
            //     });
            //     // snimamo usera
            //     user.save();
            //   }
            // });
    app.listen(PORT, () => {
      console.log('App listening on port 5500!');
    });
  })
  .catch((err) => {
    console.log(err);
  });
