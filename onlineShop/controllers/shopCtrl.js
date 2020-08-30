const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const fileHelper = require('../util/file');
const stripe = require('stripe')(process.env.STRIPE_API_KEY_SECRET);

const Product = require('../models/productsModel');
const Order = require('../models/orderModel');
const pistText = require('../util/pisiText');

const ITEMS_PER_PAGE = 2;

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

//
// Prikazujemo sve proizvode BAZA
exports.getIndex = (req, res, next) => {
  let currentPage;
  pistText.pisiText(' ----------------------------exports.getIndex');
  pistText.pisiText('req.query', req.query);
  pistText.pisiText('npr. http://localhost:5500/?page=1  upitnik u linku predstavlja oznaku query..');
  pistText.pisiText('Number(req.query.page)) ',Number(req.query.page));
  pistText.pisiText('req.query.page', req.query.page);
  pistText.pisiText('!req.query.page',!req.query.page);

  if (!req.query.page) {
    currentPage = 1;
  } else {
    currentPage = Number(req.query.page);
  }

  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      pistText.pisiText('numProducts',numProducts);
      return (totalItems = numProducts);
    })
    .then((data) => {
      pistText.pisiText('Broj Zapisa',data);
      return Product.find()
        .skip((currentPage - 1) * ITEMS_PER_PAGE) // ugradena mongose funkcija, preskace broj zapisa zapise....
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/index', {
        prod: products,
        pageTitle: 'Shop',
        path: '/',
        hasFirstPage: currentPage - 1 > 1,
        firstPage: 1,
        previousPage: currentPage - 1,
        hasPreviousPage: currentPage > 1,
        currentPage: currentPage,
        hasNextPage: ITEMS_PER_PAGE * currentPage < totalItems,
        nextPage: currentPage + 1,
        haslastPage: Math.ceil(totalItems / ITEMS_PER_PAGE) > currentPage + 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
exports.postOrder = (req, res, next) => {
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
      pistText.pisiText('brojNarudbi=', orders);
      console.log('brojNarudbi='.green, orders);

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

// DELETE
// narudzbe
exports.postDeleteOrders = (req, res, next) => {
  Order.findById({ _id: req.body.productId })
    .then((order) => {
      console.log('order-----'.red, order);

      if (!order) {
        return next(new Error('Order not found'));
      }
      console.log(order.user.userId.toString(), req.user._id.toString());
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Neautoriziran za brisanje'));
      }
      const deletefile = 'invoices/invoice-' + order._id + '.pdf';
      console.log(deletefile);

      // Provjeravam dali file postoji u /invoice
      if (fs.existsSync(deletefile)) {
        fileHelper.deleteFile(deletefile);
      }

      Order.findByIdAndDelete({ _id: req.body.productId })
        .then((order) => {
          console.log(order);
          res.redirect('/orders');
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          error.opis = ' Greška kod brisanja narudbe';
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u Invoice';
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.invoiceId;
  Order.findById({ _id: orderId })
    .then((order) => {
      if (!order) {
        return next(new Error('Order not found'));
      }
      console.log(order.user.userId.toString(), req.user._id.toString());

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Neautoriziran za gledanje'));
      }

      // file sekcija
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      // res.setHeader('Content-Type', 'application/pdf');

      // ovim headerom podesavamo da mozemo spremati file
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="' + invoiceName + '"'
      );
      res.contentType('application/pdf');

      // snimanje u invoicePath
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      // definiranje dokumenta START
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---++++++++++---------------------');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
      pdfDoc.end();

      // // ovo je dobro samo za MANJE fileove
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'attachment; filename="' + invoiceName + '"'
      //   );
      //   res.contentType('application/pdf');
      //   res.send(data);
      // });
      // // ovo je za velike fileove
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'attachment; filename="' + invoiceName + '"'
      // );
      // res.contentType('application/pdf');
      // file.pipe(res);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška u Invoice';
      return next(error);
    });
};

// Placanje karticom
exports.getCheckout = async (req, res, next) => {
  let products;
  let total;
  pistText.pisiText(' ---- exports.getCheckout', '  -  controllersshopCtrl.js');
  pistText.pisiText('req.get(host)=', req.get('host'));

  req.user
    .populate('cart.items.productId')
    .execPopulate() // Explicitly executes population and returns a promise
    .then((user) => {
      products = user.cart.items;
      pistText.pisiText('user=', user);
      pistText.pisiText('products=', products);
      total = 0;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map((p) => {
          // format zapisa koji strip treba
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      });
    })
    .then((session) => {
      res.render('shop/checkout', {
        pageTitle: 'Check out',
        path: '/checkout',
        products: products,
        totalSum: total,
        STRIPE_API_KEY: process.env.STRIPE_API_KEY_PUBLIC,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      error.opis = ' Greška xxx';
      return next(error);
    });
};

//
// create order
exports.getCheckoutSuccess = (req, res, next) => {
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
