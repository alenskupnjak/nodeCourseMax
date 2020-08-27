const express = require('express'); // setup za router
const { check, body } = require('express-validator'); // https://www.npmjs.com/package/express-validator
const authController = require('../controllers/authCtrl');

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH  /auth

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Molim unesite ispravni email.')
      .normalizeEmail(),
    body('password', 'Pasword mora biti ispravan, imati minimalno 4 slova')
      .isLength({
        min: 4,
      })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Molim unesite ispravni email.')
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('Ova email-addressa je zabranjenja.');
        }
        return true; // bez ovoga program ne moze nastaviti raditi
      })
      .normalizeEmail(),
    body(
      'password',
      'Pasword mora imati minimalno 4 slova, mora sadrzavati brojke ili slova, ne specijalne znakove.'
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password-i se moraju podudarati!');
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router; // setup za router
