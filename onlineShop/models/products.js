const fs = require('fs');
const path = require('path');

const products = [];

const pathFile = path.join(__dirname, '../data', 'products.json');
module.exports = class Product {
  constructor(title, imageUrl, price, description) {
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

      const zapis = {
        id: Math.random().toString(),
        title: this.title,
        imageUrl: this.imageUrl,
        description: this.description,
        price: +this.price,
      };
      console.log('zapis'.green, zapis);

      products.push(zapis);
      fs.writeFile(pathFile, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    // const p = path.join(__dirname, '../data', 'products.json');
    fs.readFile(pathFile, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
