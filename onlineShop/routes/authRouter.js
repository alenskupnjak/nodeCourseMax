const express = require('express'); // setup za router
const { check } = require('express-validator');
const authController = require('../controllers/authCtrl');

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH  /auth

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Molim unesite ispravni email.')
    .custom((value, { req }) => {
      if(value === 'test@test.com') {
        throw new Error('Ova email-addressa je zabranjenja.')
      }
      return true; // bez ovoga program ne moze nastaviti raditi
    }),
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router; // setup za router
