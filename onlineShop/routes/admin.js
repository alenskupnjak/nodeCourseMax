const path = require('path'); // core nodejs module
const express = require('express');

const router = express.Router();


//////////////////////////////////////////////////////////
// GET
router.get('/add-product',(req, res, next) => {    
  console.log('Middleware 02!'.red);
  // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    
  // mora biti apsolutna staza
    res.sendFile(path.join(__dirname, '../views', 'add-product.html'));
});


///////////////////////////////////////////
// POST
router.post('/add-product',(req, res, next) => {    
  console.log('tu sam');
  
  console.log(req.body);
  res.redirect('/');
});


module.exports = router