const path = require('path'); // core nodejs module
const express = require('express');
const {
  getAddProduct,
  postProduct,
  getProducts,
  getEditProduct,
} = require('../controllers/admin');

const router = express.Router();

//////////////////////////////////////////////////////////
// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postProduct);

// /admin/add-product => GET
router.get('/edit-product/:id', getEditProduct);

// module.exports = router
module.exports = router;
