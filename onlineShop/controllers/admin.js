const Product = require('../models/products');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
  });
};

// /admin/add-product => POST
exports.postProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.price,
    req.body.description
  );


  // snimamo dobivene podatke u file
  product.save();
  res.redirect('/');
};

// /admin/products => GET
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prod: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
