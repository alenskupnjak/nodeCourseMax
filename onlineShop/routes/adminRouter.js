const express = require('express'); // setup za router
const { body } = require('express-validator'); // https://www.npmjs.com/package/express-validator
const adminControler = require('../controllers/adminCtrl');
const isAuth = require('../middleware/is_auth');

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH /admin/

// add-product => GET
router.get('/add-product', isAuth, adminControler.getAddProduct);

// add-product => POST
router.post(
  '/add-product',
  [
    body('title').isLength({ min: 3 }).isString().trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 450 }).trim(),
  ],
  isAuth,
  adminControler.postAddProduct
);

// products => GET
router.get('/products', isAuth, adminControler.getProducts);

// add-product => GET
router.get('/edit-product/:id', isAuth, adminControler.getEditProduct);

// /edit-product => POST
router.post(
  '/edit-product',
  [
    body('title').isLength({ min: 3 }).isString().trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 450 }).trim(),
  ],
  isAuth,
  adminControler.postEditProduct
);

// /delete-product => POST
router.post('/delete-product', isAuth, adminControler.deleteProduct);

// EXPORT EXPORT EXPORT EXPORT EXPORT
module.exports = router;
