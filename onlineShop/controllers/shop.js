const colors = require('colors');
const Product = require('../models/products');
const User = require('../models/user');

// Dohvacanje svih proizvoda
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      // console.log(products);

      res.render('shop/product-list', {
        prod: products,
        pageTitle: 'All Products',
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
  Product.findById(prodId)
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

// Prikazujemo sve proizvode BAZA
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
};

// povlačimo sve artikle iz chart.json ako ih ima
exports.getCart = (req, res, next) => {
  try {
    // User.getCart()
    //   .then((cart) => {
    //     return cart
    //       .getProducts()
    //       .then((products) => {
    //         console.log(colors.red(products));

    //         res.render('shop/cart', {
    //           path: '/cart',
    //           pageTitle: 'Your Cart',
    //           dataRender: products,
    //         });
    //       })
    //       .catch((err) => console.log(err));
    //   })
    //   .catch((err) => console.log(err));
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
  req.podaci.push('postaCart pronalazim produkt i dodajem na chart listu')
  console.log(req.podaci);
  
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

// narubbe
exports.getOrders = async (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/cart',
  });
};
