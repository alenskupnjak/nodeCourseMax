const express = require('express'); // setup za router
const shopController = require('../controllers/shopCtrl');
const isAuth = require('../middleware/is_auth');

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH /

// prikaz svih artikala na početnoj strani
router.get('/', shopController.getIndex);

// prikaz svih podataka
router.get('/products', shopController.getProducts);

// povlačenje jednog podatka
router.get('/products/:id', shopController.getOneProduct);

// prikazujem sve kartice
router.get('/cart', isAuth, shopController.getCart);

// dodajem na listu za kupovanje artikal
router.post('/cart', isAuth, shopController.postCart);

// brišem sa liste za kupnju
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// kreiranje narudžbe
router.post('/create-order', isAuth, shopController.createOrder);

// povlačenje ordera
router.get('/orders', isAuth, shopController.getOrders);

// povlačenje ordera
router.get('/orders/:invoiceId', isAuth, shopController.getInvoice);

// povlačenje ordera
router.post('/delete-order', isAuth, shopController.postDeleteOrders);

// // kreiranje narudžbe
// router.get('/checkout', shopController.getCheckout);

module.exports = router; // setup za router
