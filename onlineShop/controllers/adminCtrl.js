const colors = require('colors');

const BiloKojeImeProduct = require('../models/productsModel');

// mongoose mongoose mongoose mongoose mongoose
// Povlačimo podatke
// ..admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    editing: false
  });
};

// mongoose mongoose mongoose mongoose mongoose
// Kreiramo zapis u bazi
// .....admin/add-product => POST
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // kreiranje novog
  const product = new BiloKojeImeProduct({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userID: req.user._id,
  });

  // kreiramo zapis
  product
    .save() // ugradena funkcija mongoose
    .then((result) => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

// mongoose mongoose mongoose mongoose mongoose
// /admin/add-product => GET
exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.id;
  BiloKojeImeProduct.findById(prodId)
    .then((products) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit proizvod',
        path: '/admin/edit-product',
        jedanProduct: products,
        editing: true
      });
    })
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose
// UPDATE
exports.postUpdateProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(title, price, description, imageUrl, prodId);
  BiloKojeImeProduct.findById(prodId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log('UPDATE Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

// mongoose mongoose mongoose mongoose mongoose
// DELETE zapis
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  BiloKojeImeProduct.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose
// dohvacanje svih zapisa iz baze
// /admin/products => GET
exports.getProducts = (req, res, next) => {
  BiloKojeImeProduct.find()
    // .select('title price -_id')  // opcija, - minus predstavlja isključivanje
    // .populate('userID', 'name')  // opcija,
    .populate('userID')
    .then((products) => {
      console.log(products);

      res.render('admin/products', {
        prod: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch((err) => console.log(err));
};
