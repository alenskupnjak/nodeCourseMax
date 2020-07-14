const express = require('express');   // setup za router
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders
} = require('../controllers/shop');

const router = express.Router(); // setup za router

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

module.exports = router; // setup za router
