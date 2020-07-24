const colors = require('colors');
const Product = require('../models/products');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    editing: false,
  });
};

// Kreiramo zapis
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user.id
  })
    .then((result) => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

// /admin/add-product => GET
exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.id;

  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit proizvod',
        path: '/admin/edit-product',
        jedanProduct: products[0],
        editing: true,
      });
    })
    .catch((err) => console.log(err));

};

exports.postUpdateProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  // const updatedTitle = req.body.title;
  // const updatedPrice = req.body.price;
  // const updatedImageUrl = req.body.imageUrl;
  // const updatedDesc = req.body.description;

  console.log('req.body.title=************************'.red,req.body.title);
  await Product.update(
    { title: req.body.title, 
      price: req.body.price, 
      description: req.body.description,
      imageUrl: req.body.imageUrl
     },
    { where: { id: prodId } }
  );
  res.redirect('/admin/products');


              // Product.findByPk(prodId)
              //   .then(product => {
              //     console.log(colors.green.underline(product));

              //     product.title = updatedTitle;
              //     product.price = updatedPrice;
              //     product.description = updatedDesc;
              //     product.imageUrl = updatedImageUrl;
              //     return product.save();
              //   })
              //   .then(result => {
              //     console.log('UPDATED PRODUCT!');
              //     res.redirect('/admin/products');
              //   })
              //   .catch(err => console.log(err));

  // const product = new Product(
  //   req.body.productId,
  //   req.body.title,
  //   req.body.imageUrl,
  //   req.body.price,
  //   req.body.description
  // );
  //   // snimamo dobivene podatke u file
  //   product.save();
  //   res.redirect('/');
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  await Product.destroy({
    where: {
      id: prodId 
    }
  });

  // vracamo se na stranicu
  res.redirect('/admin/products');
};

// /admin/products => GET
exports.getProducts = async (req, res, next) => {  
  await Product.findAll({ where: { userId: req.user.id } })
    .then((products) => {
      res.render('admin/products', {
        prod: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));

};
