const express = require('express'); // setup za router
const {
  getProducts,
  getOneProduct,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  postCart,
  deleteChart
} = require('../controllers/shop');

const router = express.Router(); // setup za router

// prikaz svih artikala na početnoj strani
router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:id', getOneProduct);

router.get('/cart', getCart);

// dodajem na listu za kupovanje artikal
router.post('/cart', postCart);
// brišem sa liste za kupnju
router.post('/cart-delete-item', deleteChart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

module.exports = router; // setup za router
