const express = require('express'); // setup za router
const authController = require('../controllers/authCtrl')

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH  /auth

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

module.exports = router; // setup za router