// const mysql = require('mysql2');


// const databasePoolMysql2 = mysql.createPool({
//   host : 'cp2.infonet.hr',
//   user : 'ucimeu96_pool',
//   port: '3306',
//   password : 'WXst5ekgGY9%',
//   database : 'ucimeu96_onlineShop'       
// });


// module.exports = databasePoolMysql2.promise();

////////////////////////////////////////////////////////////
// Sequelize MORA ici zajedno sa "mysql2" !!!!
const Sequelize = require('sequelize');

const sequelize = new Sequelize('ucimeu96_onlineShop', 'ucimeu96_pool', 'WXst5ekgGY9%', {
  dialect: 'mysql',
  host: 'cp2.infonet.hr'
});

module.exports = sequelize;