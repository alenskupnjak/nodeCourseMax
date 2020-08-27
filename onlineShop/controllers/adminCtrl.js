const colors = require('colors');
const { validationResult } = require('express-validator');

const BiloKojeImeProduct = require('../models/productsModel');

// mongoose mongoose mongoose mongoose mongoose
// Povlačimo podatke
// ..admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-add-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    errorMessage: null,
    editing: false,
    hasError: false,
    validationErrors: [],
  });
};

// Kreiramo zapis u bazi
// .....admin/add-product => POST
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // sve greške iz rutera skuplaju se u ovoj finkciji
  errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-add-product', {
      pageTitle: 'Add proizvod',
      path: '/admin/edit-product',
      errorMessage: errors.array()[0].msg,
      editing: false,
      hasError: true,
      jedanProduct: {
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }

  // kreiranje novog producta
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
      const error = new Error(err)
      error.httpStatusCode = 500;
      error.opis =' Greška u postAddProduct '
      return next(error)
    });
};

// mongoose mongoose mongoose mongoose mongoose
// /admin/add-product => GET
exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.id;
  BiloKojeImeProduct.findById(prodId)
    .then((products) => {
      // // Za potrebe testitranja programa
      // throw new Error('Glupa greška')

      if (!products) {
        return res.redirect('/');
      }
      res.render('admin/edit-add-product', {
        pageTitle: 'Edit proizvod',
        path: '/admin/edit-product',
        errorMessage: null,
        hasError: false,
        jedanProduct: products,
        editing: true,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u getEditProduct ';
      return next(error);
    });
};

// POST
// UPDATE
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // sve greške iz rutera skuplaju se u ovoj finkciji
  errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-add-product', {
      pageTitle: 'Edit proizvod',
      path: '/admin/edit-product',
      errorMessage: errors.array()[0].msg,
      editing: true,
      hasError: true,
      jedanProduct: {
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        _id: prodId,
      },
      validationErrors: errors.array(),
    });
  }

  // const product = new Product(title, price, description, imageUrl, prodId);
  BiloKojeImeProduct.findById(prodId)
    .then((product) => {
      // korisnik nije keator producta
      // alert(`product.userID= ${product.userID}, product.userID.toString()= ${product.userID.toString()}`);
      console.log('product.userID=', product.userID, product.userID.toString());
      console.log('req.user._id=', req.user._id, req.user._id.toString());

      if (product.userID.toString() !== req.user._id.toString()) {
        console.log('-------------------------xxxx');

        console.log('Korisnik nije kreator ovog proizvoda.');
        return res.redirect('/');
      }
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save().then((result) => {
        console.log('UPDATE Product');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u postEditProduct';
      return next(error);
    });
};

//
// DELETE zapis
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // BiloKojeImeProduct.findByIdAndRemove(prodId)
  BiloKojeImeProduct.deleteOne({ _id: prodId, userID: req.user._id })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u deleteProduct';
      return next(error);
    });
};

//
// dohvacanje svih zapisa iz baze
// /admin/products => GET
exports.getProducts = (req, res, next) => {
  console.log('req.user._id=', req.user._id);

  BiloKojeImeProduct.find({ userID: req.user._id })
    // .select('title price -_id')  // opcija, - minus predstavlja isključivanje
    // .populate('userID', 'name')  // opcija,
    .populate('userID')
    .then((products) => {
      console.log('tutut');

      console.log(products);

      res.render('admin/products', {
        prod: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u getProducts';
      return next(error);
    });
};
