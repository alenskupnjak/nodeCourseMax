'use strict';
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf'); // https://www.npmjs.com/package/csurf
const sessionCart = require('express-session'); //https://github.com/expressjs/session
const MongoDBStore = require('connect-mongodb-session')(sessionCart); // https://www.npmjs.com/package/connect-mongodb-session
const flash = require('connect-flash'); // https://www.npmjs.com/package/connect-flash
const multer = require('multer');

const errorController = require('./controllers/errorCtrl');
const User = require('./models/userModel');

// Usnimavanje env vars
dotenv.config({ path: './config/config.env' });

// ROUTES
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const authRoutes = require('./routes/authRouter');

// START! Kreiranje express aplikacije!
const app = express();

// podaci vidljivi za sve VIEWS !!!
app.use((req, res, next) => {
  res.locals.isAutoriziran = false;
  next();
});

// inicijalizacija za za svaki renderpage, zaštita stranice
const csrfProtection = csrf();

// za spremanje fileova
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const linkMath = Math.random().toString().slice(2, 14) + '-' + file.originalname;
    const link = new Date().toISOString().slice(0, 12) + '-' + file.originalname;
    console.log('link=', link, 'li=', linkMath);
    cb(null, linkMath  + '-' + file.originalname);
  },
});

// filtriramo ectentije slika koje mozemo koristiti u programu
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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

// body -parser, bez ovoga ne salje SAMO TEXT-DATA automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

// bodyparse za slike
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// definiranje PATH statičkih tranica za HTML ....
app.use(express.static(path.join(__dirname, 'public')));

// ako udes u path /images, idi na stazu 
app.use('/images',express.static(path.join(__dirname, 'images')));

// SESSION SESSION SESSION SESSION SESSION SESSION
app.use(
  sessionCart({
    name: 'onlineShopProduct',
    secret: process.env.SHOP_DATABASE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// aktivacija zaštite stranice od hakiranja...
app.use(csrfProtection);

// The flash is a special area of the session used for storing messages.
app.use(flash());

// podaci vidljivi za sve VIEWS !!!
app.use((req, res, next) => {
  res.locals.isAutoriziran = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ako smo logirani kreiramo User.model za pozrebe razvoja programa
app.use((req, res, next) => {
  // ako korisnik NIJE logiran preskače kreiranje usera
  if (!req.session.user) {
    return next();
  }
  // kreiramo USERA-a za rad u programu
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.user = req.user;
      res.locals.userEmail = req.user.email;

      // Za potrebe testitranja programa
      // throw new Error('Glupa greška 001');
      next();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u app.js';
      return next(error);
    });
});

// // podaci vidljivi za sve VIEWS !!!
// app.use((req, res, next) => {
//   if (req.user) {
//     res.locals.user = req.user;
//     res.locals.userEmail = req.user.email;
//   }
//   next();
// });

// // Printaj SVE
// app.use((req, res, next) => {
//   console.log('Printaj SVE- req.session'.green, req.session);
//   console.log('Printaj SVE- req.csrfToken()'.blue, req.csrfToken());
//   // console.log('Printaj SVE- req.flash()'.blue,req.mojflash ); // flash se ne smije niti printati ovako odmah je aktiviran
//   console.log('Printaj SVE- req.user-'.blue, req.user);
//   console.log('Printaj SVE- res.locals'.blue, res.locals);
//   next();
// });

// prikazi logove
// app.use(morgan('combined', { stream: accessLogStream }));

// Rute u programu
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', shopRoutes);

// app.get('/500', errorController.err500);
// zadnji middelware koji lovi sve
app.use('*', errorController.err404);

// centralno mjesto za sve greške..
// funkcija sa 4 argumenta , za greške koja je ugradena u expressss
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Greška 500',
    path: '/500',
    error: error,
    opis: error.opis,
  });
});

// definiranje porta
const PORT = process.env.PORT || 5500;

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
