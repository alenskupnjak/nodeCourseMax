const path = require('path');
const express = require('express');
const adminData = require('./admin')

const router = express.Router();

router.get('/', (req, res, next) => {
  const prod = adminData.products;
  res.render('shop', {prod: prod, docTitle:'Shop moj'})
              // mora biti apsolutna staza R01
              // res.sendFile(path.join(__dirname, '../views', 'shop.html'));
});

module.exports = router;
