// const http = require('http');  R01
const colors = require('colors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { err404 } = require('./controllers/error');

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

app.use((req, res, next) => {
  console.log('Pokusni!'.yellow);
  next(); // Allows the request to continue to the next middleware in line
});

// zadnji middelware koji lovi sve
app.use('*', err404);

app.listen(5500, () => {
  console.log(`App listening on port 5500!`);
});

// // kreiramo server  R01
// const server = http.createServer(app);
// server.listen(3200);
