const path = require('path'); // core nodejs module
const express = require('express');
const adminControler = require('../controllers/adminCtrl');

const router = express.Router();

//////////////////////////////////////////////////////////
// /admin/add-product => GET
router.get('/add-product', adminControler.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminControler.postAddProduct);

// /admin/products => GET
router.get('/products', adminControler.getProducts);

// /admin/add-product => GET
router.get('/edit-product/:id', adminControler.getEditProduct);

// /admin/add-product => GET
router.post('/edit-product', adminControler.postUpdateProduct);

// /admin/add-product => GET
router.post('/delete-product', adminControler.deleteProduct);

// module.exports = router
module.exports = router;
