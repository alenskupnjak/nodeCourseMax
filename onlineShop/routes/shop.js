const path = require('path');
const express = require('express');
const adminData = require('./admin')

const router = express.Router();

router.get('/', (req, res, next) => {
  const prod = adminData.products;
  res.render('shop', {pageTitle:'Proizvodi',prod: prod, path:'/'})
              // mora biti apsolutna staza R01
              // res.sendFile(path.join(__dirname, '../views', 'shop.html'));
});

module.exports = router;
