
const products = [];

exports.getAddProduct =  (req, res, next) => {
  // R01 res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title">
  // R01 <button type="submit">Add Product</button></form>');

  res.render('add-product', {
    pageTitle: 'Dodaj proizvod',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
  // mora biti apsolutna staza
  // res.sendFile(path.join(__dirname, '../views', 'add-product.html'));
}


exports.postProduct = (req, res, next) => {
  console.log('postProduct='.blue,req.body.title);
  
  products.push({ title: req.body.title });
  console.log(req.body);
  res.redirect('/');
}


exports.getProducts = (req, res, next) => {
  console.log(products);
  
  const prod = products;
  res.render('shop', {pageTitle:'Proizvodi',prod: prod, path:'/'})
              // mora biti apsolutna staza R01
              // res.sendFile(path.join(__dirname, '../views', 'shop.html'));
}