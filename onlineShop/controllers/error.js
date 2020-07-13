exports.err404 = (req, res, next)=>{
  res.render('404',{pageTitle:'Nepoznata stranica !', path:''})
              // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
              // res.status(404).send('<h1>Page not found<h1>')
}