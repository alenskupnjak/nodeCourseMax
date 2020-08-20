const express = require('express'); // setup za router
const adminControler = require('../controllers/adminCtrl');

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH /admin/

// add-product => GET
router.get('/add-product', adminControler.getAddProduct);

// add-product => POST
router.post('/add-product', adminControler.postAddProduct);

// products => GET
router.get('/products', adminControler.getProducts);

// add-product => GET
router.get('/edit-product/:id', adminControler.getEditProduct);

// add-product => POST
router.post('/edit-product', adminControler.postUpdateProduct);

// add-product => POST
router.post('/delete-product', adminControler.deleteProduct);

// EXPORT EXPORT EXPORT EXPORT EXPORT
module.exports = router;
