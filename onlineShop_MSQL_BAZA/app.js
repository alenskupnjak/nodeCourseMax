'use strict';
const fs = require('fs');
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { err404 } = require('./controllers/error');
const sequelize = require('./util/pooldatabase');
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const morgan = require('morgan');

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



// omogucavamo pristup useru u cijeloj aplikaciji! (req.user)
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Rute
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

// zadnji middelware koji lovi sve
app.use('*', err404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // forsiramo u developmentu da pregazi jedni druge podatke
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Alen', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    // console.log(cart);
    app.listen(3000);
    console.log('vrtim sa na Portu 3000');
    
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(5500, () => {
//   console.log(`App listening on port 5500!`);
// });

// // kreiramo server  R01
// const server = http.createServer(app);
// server.listen(3200);

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// const {
//   databaseAdminConn,
//   databaseUserConn,
//   databaseTestPool
// } = require('./util/database');

// databasePoolMysql2.execute('SELECT * FROM products').then(([podaci, ostalo]) => {
//   // zapis se vraca u obliku polja sa dva zapisa
//   // prvi je sa podacima ostalo je razno
//   console.log(colors.green(podaci, ostalo));
// });

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
