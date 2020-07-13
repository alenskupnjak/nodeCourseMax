// const http = require('http');  R01
const colors = require('colors')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');



const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')


// kreiranje express aplikaciju
const app = express();

// definiramo templete engine koji cemo koristiti u aplikaciji (EJS ili PUG ili express-handlebars)
app.set('view engine', 'pug');
// kreiramo stazu odakle cemo vuci template
app.set('views', path.join(__dirname, 'views'));

// body -parser, bez ovoga ne salje podatke automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({extended: false}));

// definiranje statičkih tranica za HTML ....
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);



app.use((req, res, next) => {
    console.log('middleware 01!'.yellow);
    next(); // Allows the request to continue to the next middleware in line
});



// zadnji middelware koji lovi sve
app.use((req, res, next)=>{
    res.render('404')
                // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
                // res.status(404).send('<h1>Page not found<h1>')
});

app.listen(5500, () => {
    console.log(`App listening on port 5500!`);
});

// // kreiramo server  R01
// const server = http.createServer(app);
// server.listen(3200);
