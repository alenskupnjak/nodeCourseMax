const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Očitavamo sve podatke ako ih ima
    fs.readFile(p, (err, fileContent) => {
      // definiramo polja za zapis na kupovnu listu
      let cart = { products: [], totalPrice: 0 };

      // ako nema greške, file postoji
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      console.log('carts'.magenta, cart);

      // Analyze the cart => Find existing product
      // ako nema tog artikla vraca undefined
      const existingProductIndex = cart.products.findIndex((prod) => {
        return prod.id === id;
      });

      const existingProduct = cart.products[existingProductIndex];
      // let updatedProduct;
      // ako artikal vec postoji na listi
      if (existingProduct) {
        // radimo kopiju
        // updatedProduct = { ...existingProduct };
        // updatedProduct.qty = updatedProduct.qty + 1;
        existingProduct.qty = existingProduct.qty + 1;
        // cart.products = [...cart.products];
        // cart.products[existingProductIndex] = updatedProduct;
        cart.products[existingProductIndex] = existingProduct;
      } else {
        // artikal ne postoji na listi, pojavio se prvi puta
        // let updatedProduct = { id: id, qty: 1 };
        // cart.products = [...cart.products, updatedProduct];
        cart.products.push({ id: id, qty: 1 });
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      // Zapisujem nove podatke u file: chart.json
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
