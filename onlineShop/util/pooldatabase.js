const mysql = require('mysql');



const databasePool = mysql.createPool({
  host : 'cp2.infonet.hr',
  user : 'ucimeu96_pool',
  port: '3306',
  password : 'WXst5ekgGY9%',
  database : 'ucimeu96_onlineShop'       
});


module.exports = databasePool;
