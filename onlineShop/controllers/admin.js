const colors = require('colors');
const Product = require('../models/products');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    editing: false
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

// /admin/add-product => GET
exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.id;
  console.log(prodId);
  Product.fetchAll((data) => {

    const podatak = data.find((product) => {
      return product.id === prodId;
    });
    console.log('podatak'.blue, colors.red.underline(podatak));

    res.render('admin/edit-product', {
      pageTitle: 'Edit proizvod',
      path: '/admin/edit-product',
      jedanProduct: podatak,
      editing: true
    });
  });
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
