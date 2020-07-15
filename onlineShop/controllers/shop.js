const colors = require('colors');
const Product = require('../models/products');
const Cart = require('../models/cart');

// Dohvacanje svih proizvoda
exports.getProducts = async (req, res, next) => {
  Product.fetchAll()
    .then(([podaci, ostaliPodaci]) => {
      res.render('shop/product-list', {
        pageTitle: 'Svi Proizvodi',
        prod: podaci,
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Dohvacanje jednog proizvoda i prikazivanje detalja
exports.getOneProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.fetchOne(prodId)
    .then(([podatak]) => {
      console.log('----------------------');
      
      console.log(podatak);
      
      res.render('shop/product-details', {
        pageTitle: 'Proizvod',
        prod: podatak[0],
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.fetchAll((data) => {
  //   const podatak = data.find((product) => {
  //     return product.id === prodId;
  //   });
  //   res.render('shop/product-details', {
  //     pageTitle: 'Proizvod',
  //     prod: podatak,
  //     path: '/products',
  //   });
  // });
};

// Prikazujemo sve proizvode
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([podaci, ostaliPodaci]) => {
      res.render('shop/index', {
        pageTitle: 'Proizvodi',
        prod: podaci,
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// povlačimo sve artikle iz chart.json ako ih ima
exports.getCart = (req, res, next) => {
  try {
    Cart.getCart((dataChart) => {
      if (dataChart) {
        Product.fetchAll((dataFile) => {
          const dataRender = [];
          dataChart.products.forEach((element) => {
            const podatak = dataFile.find((artikl) => {
              return artikl.id == element.id;
            });
            podatak.kolicina = element.qty;
            console.log(colors.blue.underline(podatak));
            dataRender.push(podatak);
          });

          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            dataRender: dataRender,
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
    Product.fetchAll((dataFile) => {
      const cijena = dataFile.find((data) => {
        return data.id === prodId;
      });
      Cart.deleteProductItem(prodId, cijena.price);
      res.redirect('/cart');
    });
  } catch (error) {
    console.log(error);
  }
};

// dodavanje artikla na kupovnu listu
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

// narubbe
exports.getOrders = async (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Vaše narudžbe',
    path: '/orders',
  });
};

exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/cart',
  });
};
