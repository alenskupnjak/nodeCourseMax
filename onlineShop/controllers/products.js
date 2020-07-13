const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
  // R01 res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title">
  // R01 <button type="submit">Add Product</button></form>');

  res.render('add-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
  // mora biti apsolutna staza
  // res.sendFile(path.join(__dirname, '../views', 'add-product.html'));
};

exports.postProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProducts = async (req, res, next) => {
  Product.fetchAll((data) => {
    res.render('shop', {
      pageTitle: 'Proizvodi',
      prod: data,
      path: '/',
      hasProducts: data.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
