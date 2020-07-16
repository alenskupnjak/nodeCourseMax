const mysql = require('mysql');


// ADMIN Create connection
exports.databaseAdminConn = mysql.createConnection({
    host : 'cp2.infonet.hr',
    user : 'ucimeu96_admin',
    port: '3306',
    password : 'amGDVV01U@*q',
    database : 'ucimeu96_onlineShop'     
});


exports.databaseUserConn = mysql.createConnection({
    host : 'cp2.infonet.hr',
    user : 'ucimeu96_user',
    port: '3306',
    password : 'A82Ale2*#D8m',
    database : 'ucimeu96_onlineShop'     
});

exports.databaseTestPool = mysql.createPool({
    host : 'cp2.infonet.hr',
    user : 'ucimeu96_test',
    port: '3306',
    password : 'sDyuH62p*#M$',
    database : 'ucimeu96_onlineShop'       
});







// setInterval(function () {
//     console.log('Prespajam svakih 15 sekundi');
//     db.query('SELECT 1');
// }, 15000);


// // Connect
// db.connect((err) => {
//     if(err){
//         throw err;
//     }
//     console.log('MySql Connected...');
// });

// module.exports = db;
