const express = require('express'); // setup za router
const {
  getProducts,
  getOneProduct,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  postCart,
} = require('../controllers/shop');

const router = express.Router(); // setup za router

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:id', getOneProduct);

router.get('/cart', getCart);

// dodajem na listu za kupovanje artikal
router.post('/cart', postCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

module.exports = router; // setup za router
