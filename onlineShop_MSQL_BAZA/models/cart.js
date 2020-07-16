const Sequelize = require('sequelize');

const sequelize = require('../util/pooldatabase');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;




/////////////////////////////////////////////////////////
// staro rijesenje
// const fs = require('fs');
// const path = require('path');
// const colors = require('colors');

// const pathFile = path.join(__dirname, '../data', 'cart.json');

// module.exports = class Cart {
//   static addProduct(id, productPrice) {
//     // Očitavamo sve podatke ako ih ima
//     fs.readFile(pathFile, (err, fileContent) => {
//       // definiramo polja za zapis na kupovnu listu
//       let cart = { products: [], totalPrice: 0 };

//       // ako nema greške, file postoji
//       if (!err) {
//         cart = JSON.parse(fileContent);
//       }
//       console.log('carts'.magenta, cart);

//       // Analyze the cart => Find existing product
//       // ako nema tog artikla vraca undefined
//       const existingProductIndex = cart.products.findIndex((prod) => {
//         return prod.id === id;
//       });

//       const existingProduct = cart.products[existingProductIndex];
//       // let updatedProduct;
//       // ako artikal vec postoji na listi
//       if (existingProduct) {
//         // radimo kopiju
//         // updatedProduct = { ...existingProduct };
//         // updatedProduct.qty = updatedProduct.qty + 1;
//         existingProduct.qty = existingProduct.qty + 1;
//         // cart.products = [...cart.products];
//         // cart.products[existingProductIndex] = updatedProduct;
//         cart.products[existingProductIndex] = existingProduct;
//       } else {
//         // artikal ne postoji na listi, pojavio se prvi puta
//         // let updatedProduct = { id: id, qty: 1 };
//         // cart.products = [...cart.products, updatedProduct];
//         cart.products.push({ id: id, qty: 1 });
//       }
//       cart.totalPrice = cart.totalPrice + +productPrice;

//       // Zapisujem nove podatke u file: chart.json
//       fs.writeFile(pathFile, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static deleteProductItem(id, cijena) {
//     console.log('id=',id,'cijena',cijena);
    
//     fs.readFile(pathFile, (err, fileContent) => {
//       try {
//         // definiramo polja za zapis na kupovnu listu
//         let cart = { products: [], totalPrice: 0 };

//         // radimo kopiju
//         const cartData = { ...JSON.parse(fileContent) };

//         // ocitavamo kolicinu iz datoteke
//         const kolicina = cartData.products.find((data) => {
//           return data.id === id;
//         });

//         const novaUkupnaCijena = cartData.totalPrice - kolicina.qty * +cijena;

//         // console.log(colors.blue('Staracijena=', cartData.totalPrice));
//         // console.log(colors.blue(kolicina.qty, cijena, novaUkupnaCijena));

//         const indexPostojeceg = cartData.products.findIndex((data) => {
//           return data.id === id;
//         });

//         // brišem iz zapisa
//         cartData.products.splice(indexPostojeceg, 1);

//         // definiram novi Zapisujem
//         cart.products = cartData.products;
//         cart.totalPrice = +novaUkupnaCijena;

//         // console.log(colors.blue.underline(cart));

//         // Zapisujem nove podatke u file: chart.json
//         fs.writeFile(pathFile, JSON.stringify(cart), (err) => {
//           console.log(err);
//         });
//       } catch (error) {
//         console.log('greška u deleteProductItem');
//       }
//     });
//   }

//   //povlačimo podatke iz ../data/cart.json
//   static getCart(cb) {
//     fs.readFile(pathFile , (err, fileContent) => {
//       const cart = JSON.parse(fileContent);
//       if (err) {
//         cb(null);
//       } else {
//         cb(cart);
//       }
//     });
//   }
// };
