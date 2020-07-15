const fs = require('fs');
const colors = require('colors');
const path = require('path');
const Cart = require('../models/cart')

const products = [];

const pathFile = path.join(__dirname, '../data', 'products.json');
module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    fs.readFile(pathFile, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }

      if (this.id) {
        console.log('*****imam id*************'.green);

        const indexPostojeceg = products.findIndex((data) => {
          return data.id === this.id;
        });

        console.log('indexPostojeceg'.bgMagenta, indexPostojeceg);

        products[indexPostojeceg] = {
          id: this.id,
          title: this.title,
          imageUrl: this.imageUrl,
          description: this.description,
          price: +this.price,
        };
      } else {
        console.log('*****nemam  id*************'.red);
        const zapis = {
          id: Math.random().toString(),
          title: this.title,
          imageUrl: this.imageUrl,
          description: this.description,
          price: +this.price,
        };
        console.log('zapis'.green, zapis);
        products.push(zapis);
      }

      // na kraju pišem u file
      fs.writeFile(pathFile, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static delete(id) {
    fs.readFile(pathFile, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }

      const indexPostojeceg = products.findIndex((data) => {
        return data.id === id;
      });

      // povlacimo trenutnu cijenu iz baze koju cemo koristiti kod chart.baze
      const cijena = products[indexPostojeceg].price;

      // Obrisi podatke iz chart
      Cart.deleteProductItem(id, cijena);

      products.splice(indexPostojeceg, 1);

      // na kraju pišem u file
      fs.writeFile(pathFile, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(pathFile, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
