const colors = require('colors');
const Product = require('../models/products');
const Cart = require('../models/cart');

// Dohvacanje svih proizvoda
exports.getProducts = async (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prod: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // rijesenje sa mysql2, direkno spajanje na bazu
  // Product.fetchAll()
  //   .then(([podaci, ostaliPodaci]) => {
  //     res.render('shop/product-list', {
  //       pageTitle: 'Svi Proizvodi',
  //       prod: podaci,
  //       path: '/products',
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// Dohvacanje jednog proizvoda i prikazivanje detalja
exports.getOneProduct = (req, res, next) => {
  const prodId = req.params.id;
  // rijesenje sa find all
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render('shop/product-detail', {
        prod: products[0],
        pageTitle: products[0].title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));

  // rijesenje sa find id
  //   Product.findByPk(prodId)
  //   .then(product => {
  //     console.log('hhh***********************************');
  //   console.log(product.dataValues);
  //   console.log(product.title);

  //   res.render('shop/product-detail', {
  //     prod: product,
  //     pageTitle: product.title,
  //     path: '/products'
  //   });
  // })
  // .catch(err => console.log(err));

  // rad sa MSQL bazom, direktan upit
  // Product.fetchOne(prodId)
  //   .then(([podatak]) => {
  //     console.log('----------------------');

  //     console.log(podatak);

  //     res.render('shop/product-details', {
  //       pageTitle: 'Proizvod',
  //       prod: podatak[0],
  //       path: '/products',
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // rad sa datotekama
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

// Prikazujemo sve proizvode BAZA
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prod: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.fetchAll()
  //   .then(([podaci, ostaliPodaci]) => {
  //     res.render('shop/index', {
  //       pageTitle: 'Proizvodi',
  //       prod: podaci,
  //       path: '/',
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// povlačimo sve artikle iz chart.json ako ih ima
exports.getCart = (req, res, next) => {
  try {
    req.user
      .getCart()
      .then((cart) => {
        return cart
          .getProducts()
          .then((products) => {
            console.log(colors.red(products));

            products.forEach((data) => {
              console.log('+++++');

              // console.log(data);
              console.log(data.title);
              console.log(data.cartItem.quantity);
            });
            // console.log(colors.green(products.cartItem.cartId));

            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              dataRender: products,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    // Cart.findAll({ where: { userId: req.user.id } })
    //   .then((products) => {
    //     console.log('*****************');

    //     console.log(products);

    //     res.render('shop/cart', {
    //       pageTitle: 'Your Cart',
    //       path: '/cart',
    //       dataRender: products,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // Cart.getCart((dataChart) => {
    //   if (dataChart) {
    //     Product.fetchAll((dataFile) => {
    //       const dataRender = [];
    //       dataChart.products.forEach((element) => {
    //         const podatak = dataFile.find((artikl) => {
    //           return artikl.id == element.id;
    //         });
    //         podatak.kolicina = element.qty;
    //         console.log(colors.blue.underline(podatak));
    //         dataRender.push(podatak);
    //       });

    //       res.render('shop/cart', {
    //         pageTitle: 'Your Cart',
    //         path: '/cart',
    //         dataRender: dataRender,
    //       });
    //     });
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
};

// Delete charte artikle iz chart.json ako ih ima
exports.deleteChart = (req, res, next) => {
  try {
    const prodId = req.body.productId;

    req.user
      .getCart()
      .then((cart) => {
        return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
        const product = products[0];
        return product.cartItem.destroy();
      })
      .then((result) => {
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
    // const prodId = req.body.productId;
    // Product.fetchAll((dataFile) => {
    //   const cijena = dataFile.find((data) => {
    //     return data.id === prodId;
    //   });
    //   Cart.deleteProductItem(prodId, cijena.price);
    //   res.redirect('/cart');
    // });
  } catch (error) {
    console.log(error);
  }
};

// dodavanje artikla na kupovnu listu
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));

  // console.log('prodId'.blue, req.body.productId);
  // Product.fetchAll((data) => {
  //   const podatak = data.find((product) => {
  //     return product.id === prodId;
  //   });

  //   // dodajem artikal kupovnoj listi
  //   Cart.addProduct(prodId, podatak.price);

  // odlazimo na stranicu narudbi
  res.redirect('/cart');
  // });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

// narubbe
exports.getOrders = async (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/cart',
  });
};
