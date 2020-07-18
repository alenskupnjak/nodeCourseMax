const colors = require('colors');
const Product = require('../models/products');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    editing: false,
  });
};

// Kreiramo zapis u bazi
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    // req.user._id
  );
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

// /admin/add-product => GET
exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then((products) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit proizvod',
        path: '/admin/edit-product',
        jedanProduct: products,
        editing: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.postUpdateProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl, prodId);
  product
    .update()
    .then((result) => {
      console.log('UPDATE Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

// /admin/products => GET
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prod: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};
