const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/userModel');
const { reset } = require('colors');

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
  host: process.env.EMAIL_HOST_MAILTRAP,
  port: process.env.EMAIL_PORT_MAILTRAP,
  auth: {
    user: process.env.EMAIL_USERNAME_MAILTRAP,
    pass: process.env.EMAIL_PASSWORD_MAILTRAP,
  },
});

//
// prikaz LOGIN forme
exports.getLogin = (req, res, next) => {
  let message = req.flash('greska');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'Login',
    errorMessage: message,
  });
};

//
// GET_SIGNUP GET_SIGNUP GET_SIGNUP GET_SIGNUP GET_SIGNUP
exports.getSignup = (req, res, next) => {
  let message = req.flash('greska');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
    pageTitle: 'SignUp',
    errorMessage: message,
  });
};

// LOGIN LOGIN LOGIN LOGIN LOGIN LOGIN LOGIN
// Logiranje na WEB-stranicu
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      // user ne postoji vracamo ga na login
      if (!user) {
        req.flash('greska', 'Invalid email or password.');
        return res.redirect('/auth/login');
      }

      // user postoji, provjera da li je password OK
      bcrypt
        .compare(password, user.password) // vraca vrijednost true/false
        .then((tocanPassword) => {
          // invalid password vracamo na login stranicu
          if (!tocanPassword) {
            req.flash('greska', 'Invalid email or password.');
            return res.redirect('/auth/login');
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
          console.log(err);
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
        req.flash('greska', 'Korisnik već postoji!');
        return res.redirect('/auth/signup');
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
          console.log(err);
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

// RESET RESET PASSWORD form
exports.getReset = (req, res, next) => {
  let message = req.flash('greska');
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
        if (!user) {
          req.flash('greska', 'Korisnik sa takvim email-om ne postoji!');
          return res.redirect('/auth/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1000 * 60 * 60; // jedan sat
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
        console.log(err);
      });
  });
};

// hohvacanje linka
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      console.log('user'.red, user);
      
      let message = req.flash('greska');
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
      console.log(err);
    });
};

// hohvacanje linka
exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const passwordToken = req.body.passwordToken;
  let resetUser;
console.log('userId= ',userId);

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
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/auth/login');
    })
    .catch((err) => {
      console.log(err);
    });
};
