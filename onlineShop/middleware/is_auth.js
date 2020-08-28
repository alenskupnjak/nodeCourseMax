module.exports = (req, res, next) => {
  // korisnik nije logiran, vracamo ga na početni stranicu
  if (!req.session.isLoggedIn) {
    return res.status(401).redirect('/auth/login');
  }
  next();
};
