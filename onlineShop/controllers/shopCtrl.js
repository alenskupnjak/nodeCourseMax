const colors = require('colors');
const Product = require('../models/productsModel');
const User = require('../models/userModel');

// mongoose mongoose mongoose mongoose mongoose 
// Dohvacanje svih proizvoda
exports.getProducts = (req, res, next) => {
  console.log('Broj zapisa u bazi= ',Product.count());
  
  Product.find()  // ugradena mongoose funkcija
    .then((products) => {
      console.log(products);

      res.render('shop/product-list', {
        prod: products,
        pageTitle: 'Svi proizvodi',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// mongoose mongoose mongoose mongoose mongoose 
// Dohvacanje jednog proizvoda i prikazivanje detalja
exports.getOneProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId) // ugradena funkcija mongoose
    .then((product) => {
      console.log(product);
      res.render('shop/product-detail', {
        prod: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose 
// Prikazujemo sve proizvode BAZA
exports.getIndex = (req, res, next) => {
  const numAdventures = Product.estimatedDocumentCount();
  Product.find()
    .then((products) => {
      console.log(products);
      
      res.render('shop/index', {
        prod: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// povlačimo sve artikle iz chart.json ako ih ima
// router GET
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      console.log(colors.red(products));
      
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        dataRender : products
      });
    })
    .catch(err => console.log(err));
};

// Delete charte artikle iz chart.json ako ih ima
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};




// dodavanje artikla na kupovnu listu
exports.postCart = (req, res, next) => {  
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};


//
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

// narubbe
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};


//
exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/cart',
  });
};
