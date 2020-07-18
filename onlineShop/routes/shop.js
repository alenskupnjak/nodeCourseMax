const express = require('express'); // setup za router
const shopController = require('../controllers/shop')

const router = express.Router(); // setup za router

// prikaz svih artikala na početnoj strani
router.get('/', shopController.getIndex);

//
router.get('/products', shopController.getProducts);

// povlačenje jednog podatka
router.get('/products/:id', shopController.getOneProduct);

// router.get('/cart', shopController.getCart);

// // dodajem na listu za kupovanje artikal
// router.post('/cart', shopController.postCart);
// // brišem sa liste za kupnju
// router.post('/cart-delete-item', shopController.deleteChart);

// // kreiranje narudžbe
// router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

// router.get('/checkout', shopController.getCheckout);

module.exports = router; // setup za router
