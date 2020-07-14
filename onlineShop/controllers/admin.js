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
    null,
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

exports.postUpdateProduct = (req, res, next) => {
  const prodId = req.params.productId;  
  const product = new Product(
    req.body.productId,
    req.body.title,
    req.body.imageUrl,
    req.body.price,
    req.body.description
  );

    // snimamo dobivene podatke u file
    product.save();
    res.redirect('/');
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;  
  console.log(prodId);
  
    // snimamo dobivene podatke u file
    Product.delete(prodId);
    res.redirect('/products');
}

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
