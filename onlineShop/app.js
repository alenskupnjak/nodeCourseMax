// const http = require('http');  R01
const colors = require('colors')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');



const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')


// kreiranje express aplikaciju
const app = express();

// body -parser, bez ovoga ne salje podatke automatski kroz req.body (npm i body-parser)
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin',adminRoutes);
app.use(shopRoutes);



app.use((req, res, next) => {
    console.log('middleware 01!'.yellow);
    next(); // Allows the request to continue to the next middleware in line
});




app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    // res.status(404).send('<h1>Page not found<h1>')
});

app.listen(5500, () => {
    console.log(`App listening on port 5500!`);
});

// // kreiramo server  R01
// const server = http.createServer(app);
// server.listen(3200);
