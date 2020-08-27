exports.err404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Nepoznata stranica !',
    path: '/404',
    isAutoriziran: req.session.isLoggedIn ,
  });
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  // res.status(404).send('<h1>Page not found<h1>')
};

exports.err500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Nepoznata stranica !',
    path: '/500',
    isAutoriziran: req.session.isLoggedIn ,
  });
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  // res.status(404).send('<h1>Page not found<h1>')
};
