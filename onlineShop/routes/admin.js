const path = require('path'); // core nodejs module
const express = require('express');
const { getAddProduct, postProduct, getProducts } = require('../controllers/admin');

const router = express.Router();

//////////////////////////////////////////////////////////
// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts );


// /admin/add-product => POST
router.post('/add-product', postProduct);

// module.exports = router
module.exports = router;
