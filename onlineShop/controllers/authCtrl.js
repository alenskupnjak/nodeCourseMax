exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAutoriziran: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;

  res.setHeader('Set-Cookie', 'loggedIn=true');
  // res.render('auth/login', {
  //   path: '/login',
  //   pageTitle: 'Login',
  // });

  res.redirect('/');
};
