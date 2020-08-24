const express = require('express'); // setup za router
const adminControler = require('../controllers/adminCtrl');
const isAuth = require('../middleware/is_auth');

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH /admin/

// add-product => GET
router.get('/add-product', isAuth, adminControler.getAddProduct);

// add-product => POST
router.post('/add-product', isAuth, adminControler.postAddProduct);

// products => GET
router.get('/products', isAuth, adminControler.getProducts);

// add-product => GET
router.get('/edit-product/:id', isAuth, adminControler.getEditProduct);

// add-product => POST
router.post('/edit-product', isAuth, adminControler.postUpdateProduct);

// add-product => POST
router.post('/delete-product', isAuth, adminControler.deleteProduct);

// EXPORT EXPORT EXPORT EXPORT EXPORT
module.exports = router;
