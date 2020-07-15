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

// Delete charte artikle iz chart.json ako ih ima
exports.deleteChart = (req, res, next) => {
  try {
    const prodId = req.body.productId;
    console.log('prodId', prodId);
    Product.fetchAll((dataFile) => {
      console.log(dataFile);
      const cijena = dataFile.find((data)=> {
        return data.id === prodId
      })
      console.log('cijena'.red.underline, cijena.price);
      Cart.deleteProductItem(prodId,cijena.price)
      res.redirect('/cart');
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

    // dodajem artikal kupovnoj listi
    Cart.addProduct(prodId, podatak.price);

    // odlazimo na stranicu narudbi
    res.redirect('/cart');
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
