const path = require('path'); // core nodejs module
const express = require('express');

const router = express.Router();

const products = [];


//////////////////////////////////////////////////////////
// GET
router.get('/add-product',(req, res, next) => {    
                      // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title">
                      // <button type="submit">Add Product</button></form>');
  res.render('add-product', {pageTitle: 'Dodaj proizvod', path:'/admin/add-product'})
                      // mora biti apsolutna staza
                      // res.sendFile(path.join(__dirname, '../views', 'add-product.html'));
});


///////////////////////////////////////////
// POST
router.post('/add-product',(req, res, next) => {    
  products.push({ title: req.body.title });
  console.log(req.body);
  res.redirect('/');
});


// module.exports = router
exports.routes = router;
exports.products = products;