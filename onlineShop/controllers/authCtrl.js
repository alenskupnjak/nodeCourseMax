const User = require('../models/userModel');

// LOGIN forma
exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAutoriziran: req.session.isLoggedIn,
  });
};

//
// Logiranje na WEB-stranicu
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  User.findById('5f3d0577469cb830c0bbf38c')
    .then((user) => {
      // definiran user koji se provlaci kroz cijelu aplikaciju
      req.nekiPodaci = 'Ovo su neki podaci';
      // definicija user-a za daljnji radu u programu
      req.session.user = user;
      req.session.pokus = 'pokusniText'; // neki pokusni text

      // ovimo smo sigurni da se je operacija snimanja u bazi zavrsena
      // zbog toga smo sigurni da ce refres (res.redirect('/');) biti OK.
      req.session.save((err) => {
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

// LOGOUT sa WEB-stranicu
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
