const Product = require('../models/products');
const Cart = require('../models/cart');

// Dohvacanje svih proizvoda
exports.getProducts = async (req, res, next) => {
  Product.fetchAll((data) => {
    res.render('shop/product-list', {
      pageTitle: 'Svi Proizvodi',
      prod: data,
      path: '/products',
    });
  });
};

// Dohvacanje svih proizvoda
exports.getOneProduct = (req, res, next) => {
  const prodId = req.params.id;

  Product.fetchAll((data) => {
    const podatak = data.find((product) => {
      return product.id === prodId;
    });
    res.render('shop/product-details', {
      pageTitle: 'Proizvod',
      prod: podatak,
      path: '/products',
    });
  });
  // next();
};

//
exports.getIndex = (req, res, next) => {
  Product.fetchAll((data) => {
    res.render('shop/index', {
      pageTitle: 'Proizvodi',
      prod: data,
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('prodId'.blue, req.body.productId);
  Product.fetchAll((data) => {

    const podatak = data.find((product) => {
      return product.id === prodId;
    });
    console.log('price'.blue, podatak);

    // dodajem artikal kupovnoj listi
    Cart.addProduct(prodId, podatak.price);

    res.redirect('/cart');
    // res.render('shop/product-details', {
    //   pageTitle: 'Proizvod',
    //   prod: podatak,
    //   path: '/products',
    // });
  });
};

exports.getOrders = async (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Vaše narudžbe',
    path: '/orders',
  });
};

exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/chart',
  });
};
