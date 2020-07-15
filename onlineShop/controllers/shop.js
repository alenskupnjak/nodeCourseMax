const colors = require('colors');
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

// Dohvacanje jednog proizvoda i prikazivanje detalja
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

// Prikazujemo sve proizvode
exports.getIndex = (req, res, next) => {
  Product.fetchAll((data) => {
    res.render('shop/index', {
      pageTitle: 'Proizvodi',
      prod: data,
      path: '/',
    });
  });
};

// povlačimo sve artikle iz chart.json ako ih ima
exports.getCart = (req, res, next) => {
  try {
    Cart.getCart((dataChart) => {
      if (dataChart) {
        Product.fetchAll((dataFile) => {
          console.log(colors.red(dataChart));
          console.log(colors.green(dataFile));
          const dataRender = []
          dataChart.products.forEach((element) => {
            console.log(colors.magenta(element));
            const podatak = dataFile.find((artikl) => {
              return artikl.id == element.id;
            });
            podatak.kolicina = element.qty
            console.log(colors.blue.underline(podatak));
            dataRender.push(podatak)
          });

          console.log(colors.yellow(dataRender));
          

          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            dataRender: dataRender
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
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
