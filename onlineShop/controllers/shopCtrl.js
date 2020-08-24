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
        isAutoriziran: req.session.isLoggedIn,
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
        isAutoriziran: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose
// Prikazujemo sve proizvode BAZA
exports.getIndex = (req, res, next) => {
  const numAdventures = Product.estimatedDocumentCount();
  console.log('getIndex-req.session='.red,req.session, );
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prod: products,
        pageTitle: 'Shop',
        path: '/',
        isAutoriziran: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// mongoose mongoose mongoose mongoose mongoose
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
        isAutoriziran: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose
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
          name: req.user.name,
          userId: req.user._id,
        },
        products: productsData,
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
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose
// narudzbe
exports.getOrders = (req, res, next) => {
  console.log('getOrders - isAutoriziran:= '.red, req.session.isLoggedIn);
  
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      let duljina = orders.length
      console.log(duljina);
      
      res.render('shop/orders', {
        path: '/orders', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
        pageTitle: 'Your Orders',
        orders: orders,
        isAutoriziran: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// mongoose mongoose mongoose mongoose mongoose
// narudzbe
exports.postDeleteOrders = (req, res, next) => {
  console.log(req.body);

  Order.find({ _id: req.body.productId })
    .then((order) => {
      console.log(order);
      // res.render('shop/orders', {
      //   path: '/orders', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
      //   pageTitle: 'Your Orders',
      //   orders: orders,
      //   isAutoriziran: req.session.isLoggedIn,
      // });
    })
    .catch((err) => console.log(err));

  Order.findByIdAndDelete({ _id: req.body.productId })
    .then((order) => {
      console.log(order);
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

//
exports.getCheckout = async (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Check out',
    path: '/cart', // path nam služi za odredivanje aktivnog menija u navbaru, (navigation.ejs)
  });
};
