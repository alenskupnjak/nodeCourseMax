const Product = require('../models/productsModel');
const Order = require('../models/orderModel');

// mongoose mongoose mongoose mongoose mongoose
// Dohvacanje svih proizvoda
exports.getProducts = (req, res, next) => {
  Product.find() // ugradena mongoose funkcija
    .then((products) => {
      res.render('shop/product-list', {
        prod: products,
        pageTitle: 'Svi proizvodi',
        path: '/products',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// mongoose mongoose mongoose mongoose mongoose
// Prikazujemo sve proizvode BAZA
exports.getIndex = (req, res, next) => {
  const numAdventures = Product.estimatedDocumentCount();
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prod: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// -----------------------------------
// povlačimo sve artikle
// router GET
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate() // Explicitly executes population and returns a promise
    .then((user) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        dataRender: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

//------------------------------------------
// dodavanje artikla na kupovnu listu
// router POST
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

// mongoose mongoose mongoose mongoose mongoose
// Delete cart artikle ako ih ima
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// mongoose mongoose mongoose mongoose mongoose
// create order
exports.createOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    //https://mongoosejs.com/docs/api.html#document_Document-execPopulate
    .execPopulate() // Explicitly executes population and returns a promise
    .then((user) => {
      const productsData = user.cart.items.map((i) => {
        // return { quantity: i.quantity, product: i.productId };
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      // kreiramo novu narudžbu
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: productsData,
        created: Date.now(),
      });
      // snimamo order
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// mongoose mongoose mongoose mongoose mongoose
// narudzbe
exports.getOrders = (req, res, next) => {
  console.log('getOrders - isAutoriziran:= '.red, req.session.isLoggedIn);
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      console.log('brojNarudbi='.green, orders.length);

      res.render('shop/orders', {
        path: '/orders', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

// mongoose mongoose mongoose mongoose mongoose
// narudzbe
exports.postDeleteOrders = (req, res, next) => {
  Order.findByIdAndDelete({ _id: req.body.productId })
    .then((order) => {
      console.log(order);
      res.redirect('/orders');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

//
exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/cart', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
  });
};
