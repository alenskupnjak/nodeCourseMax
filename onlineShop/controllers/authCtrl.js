const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const sgTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/userModel');

// TRANSPORTER SENDGRID setup
// const transporter = nodemailer.createTransport(
//   sgTransport({
//     auth: {
//       api_key: process.env.API_KEY_SENDGRID,
//     },
//   })
// );

//
// TRANSPORTER MAILTRAP setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_MAILTRAP,
  port: process.env.SMTP_PORT_MAILTRAP,
  auth: {
    user: process.env.SMTP_USERNAME_MAILTRAP,
    pass: process.env.SMTP_PASSWORD_MAILTRAP,
  },
});

//
// prikaz LOGIN forme
exports.getLogin = (req, res, next) => {
  let message = req.flash('poruka');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: 'test02@mailsac.com',
      password: '123456',
    },
    validationErrors: [],
  });
};

//
// GET_SIGNUP GET_SIGNUP GET_SIGNUP GET_SIGNUP GET_SIGNUP
exports.getSignup = (req, res, next) => {
  let message = req.flash('poruka');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'SignUp',
    errorMessage: message,
    oldInput: {
      email: 'test0x@mailsac.com',
      password: '123456',
      confirmPassword: '123456',
    },
    validationErrors: [],
  });
};

// POST_LOGIN POST_LOGIN POST_LOGIN POST_LOGIN
// Logiranje na WEB-stranicu
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // sve greške iz rutera skuplaju se u ovoj finkciji
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    // renderiramo postojeću stranicu
    return res.status(422).render('auth/login', {
      path: '/login', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      // user ne postoji vracamo ga na login
      if (!user) {
        req.flash('poruka', 'Invalid email or password.');
        return res.redirect('/auth/login');
      }

      // user postoji, provjera da li je password OK
      bcrypt
        .compare(password, user.password) // vraca vrijednost true/false
        .then((tocanPassword) => {
          // invalid password vracamo na login stranicu
          if (!tocanPassword) {
            req.flash('poruka', 'Invalid email or password.');
            // return res.redirect('/auth/login');
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Invalid email or password.',
              oldInput: {
                email: email,
                password: password,
              },
              validationErrors: [],
            });
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
            if (err) {
              console.log(err);
            }
            res.redirect('/');
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          error.opis = ' Greška xxx';
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

//
// SIGNUP SIGNUP SIGNUP SIGNUP SIGNUP SIGNUP
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // sve greške iz rutera skuplaju se u ovoj finkciji
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    // renderiramo postojeću stranicu
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'SignUp',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      // ako korisnik postoji, vracamo ga na /signup
      if (userDoc) {
        req.flash('poruka', 'Korisnik već postoji!');
        return res.redirect('/auth/signup');
      }

      // enkripcija passworda
      return bcrypt
        .hash(password, 12)
        .then((hasedPassword) => {
          const user = new User({
            email: email,
            password: hasedPassword,
            passwordTemp: password,
            name: 'neko ime',
            cart: { items: [] },
          });
          // moramo snimiti usera
          return user.save();
        })
        .then((result) => {
          res.redirect('/auth/login');
          return transporter.sendMail({
            from: 'skupnjaka@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Kreiran account', // Subject line
            text: 'Hello world?', // plain text body
            html: '<p>Uspjesna prijava</p>', // html body
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          error.opis = ' Greška xxx';
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

// RESET RESET PASSWORD form
exports.getReset = (req, res, next) => {
  let message = req.flash('poruka');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

// RESET RESET PASSWORD form
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/auth/reset');
    }
    // kreiramo token
    const token = buffer.toString('hex');
    // Pronalazimo usera
    User.findOne({ email: req.body.email })
      .then((user) => {
        // korisnik NE postoji
        if (!user) {
          req.flash('poruka', 'Korisnik sa takvim email-om ne postoji!');
          return res.redirect('/auth/reset');
        }
        // korisnik DA postoji
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1000 * 60 * 60; // jedan sat, milisekinde....
        return user.save();
      })
      .then((user) => {
        console.log('user:'.red, user, 'req.body.email'.red, req.body.email);

        res.redirect('/');
        return transporter.sendMail({
          from: 'skupnjaka@gmail.com', // sender address
          to: req.body.email, // list of receivers
          subject: 'Password reset', // Subject line
          // text: 'Hello world?', // plain text body
          html: `<p>Resetiraj password<p>
                <p>Klikni <a href="http://localhost:5500/auth/new-password/${token}">link</a><p>
          `, // html body
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        error.opis = ' Greška xxx';
        return next(error);
      });
  });
};

// dohvacanje linka
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      console.log('user'.red, user);

      let message = req.flash('poruka');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
        pageTitle: 'New password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// dohvacanje linka
exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  console.log('userId= ', userId);

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      console.log('user'.red, user);

      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.passwordTemp = newPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/auth/login');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};
