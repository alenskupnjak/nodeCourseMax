const express = require('express');   // setup za router
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
} = require('../controllers/shop');

const router = express.Router(); // setup za router

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

module.exports = router; // setup za router
