const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

// LOGIN LOGIN LOGIN LOGIN LOGIN
exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
  res.render('auth/login', {
    path: '/login', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'Login',
    isAutoriziran: req.session.isLoggedIn,
  });
};

//
// GET_SIGNUP GET_SIGNUP GET_SIGNUP GET_SIGNUP GET_SIGNUP
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'SignUp',
    isAutoriziran: req.session.isLoggedIn,
  });
};

// LOGIN LOGIN LOGIN LOGIN LOGIN LOGIN LOGIN
// Logiranje na WEB-stranicu
exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'PokusniSetCookie=true');
  console.log('req.body'.blue, req.body);
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      // user ne postoji vracamo ga na login
      if (!user) {
        return res.redirect('/login');
      }

      // user postoji, provjera da li je password OK
      bcrypt
        .compare(password, user.password) // vraca vrijednost true/false
        .then((tocanPassword) => {
          // invalid password vracamo na login stranicu
          if (!tocanPassword) {
            return res.redirect('/login');
          }
          // password je točan...
          // definicija user-a za daljnji radu u programu
          req.session.isLoggedIn = true;
          req.session.user = user;
          // definiran user koji se provlaci kroz cijelu aplikaciju
          req.nekiPodaci = 'Ovo su neki podaci';

          req.session.pokus = 'pokusniText'; // neki pokusni text
          req.session.created = new Date();
          // ovimo smo sigurni da se je operacija snimanja u bazi zavrsena
          // zbog toga smo sigurni da ce refres (res.redirect('/');) biti OK.
          req.session.save((err) => {
            console.log(err);
            res.redirect('/');
          });
        })
        .catch((err) => {console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

//
// SIGNUP SIGNUP SIGNUP SIGNUP SIGNUP SIGNUP
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log(req.body);
  User.findOne({ email: email })
    .then((userDoc) => {
      // ako korisnik postoji, vracamo ga na /signup
      if (userDoc) {
        return res.redirect('/signup');
      }

      // enkripcija passworda
      return bcrypt
        .hash(password, 12)
        .then((hasedPassword) => {
          const user = new User({
            email: email,
            password: hasedPassword,
            name: 'neko ime',
            cart: { items: [] },
          });
          // moramo snimiti usera
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
