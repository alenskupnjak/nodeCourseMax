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

// Kreiramo zapis
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
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

    // snimamo dobivene podatke u file
    Product.delete(prodId);

    // vracamo se na stranicu
    res.redirect('/admin/products');
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
