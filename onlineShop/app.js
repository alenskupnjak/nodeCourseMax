// const http = require('http');  R01
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { err404 } = require('./controllers/error');
const {
  databaseAdminConn,
  databaseUserConn,
  databaseTestPool
} = require('./util/database');



const databasePoolMysql2  = require('./util/pooldatabase')

databasePoolMysql2.execute('SELECT * FROM products').then(([podaci, ostalo]) => {
  // zapis se vraca u obliku polja sa dva zapisa
  // prvi je sa podacima ostalo je razno
  console.log(colors.green(podaci, ostalo));
});

// spajam se na bazu kao admin
// databaseAdminConn.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySql Connected kao admin...');
// });

// // // spajam se na bazu kao User
// databaseUserConn.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySql Connected kao user...');
// });

// // // spajam se na bazu kao test   user : 'ucimeu96_test',
// databaseTestPool.query('SELECT * FROM products',function (error, results, fields) {
//   console.log(colors.red(results));
// });


// // // spajam se na bazu kao user : 'ucimeu96_pool',
// databasePool.query('SELECT * FROM products',function (error, results, fields) {
//   console.log(results);
// });


// ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// kreiranje express aplikaciju
const app = express();

// definiramo template engine koji cemo koristiti u aplikaciji (EJS ili PUG ili express-handlebars)
// app.set('view engine', 'pug'); // za pug
app.set('view engine', 'ejs'); // za ejs
// kreiramo stazu odakle cemo vuci template
app.set('views', path.join(__dirname, 'views'));

// body -parser, bez ovoga ne salje podatke automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({ extended: false }));

// definiranje statičkih tranica za HTML ....
app.use(express.static(path.join(__dirname, 'public')));

// Rute
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// zadnji middelware koji lovi sve
app.use('*', err404);

app.listen(5500, () => {
  console.log(`App listening on port 5500!`);
});

// // kreiramo server  R01
// const server = http.createServer(app);
// server.listen(3200);
