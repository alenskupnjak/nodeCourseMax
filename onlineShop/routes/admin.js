const path = require('path'); // core nodejs module
const express = require('express');
const { getAddProduct, postProduct } = require('../controllers/products');

const router = express.Router();

//////////////////////////////////////////////////////////
// GET
router.get('/add-product', getAddProduct);
router.post('/add-product', postProduct);

// module.exports = router
module.exports = router;
