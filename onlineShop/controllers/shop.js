const Product = require('../models/products');


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


// 
exports.getIndex = async (req, res, next) => {
  Product.fetchAll((data) => {
    res.render('shop/index', {
      pageTitle: 'Proizvodi',
      prod: data,
      path: '/',
    });
  });
};

exports.getCart = async (req, res, next) => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
    });
};

exports.getCheckout = async (req, res, next) => {
    res.render('shop/index', {
      pageTitle: 'Check out',
      path: '/chart',
    });
};
