const colors = require('colors');
const mysql = require('mysql2');
const Cart = require('../models/cart');
const databasePoolMysql2 = require('../util/pooldatabase');


module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return databasePoolMysql2.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static delete(id) {}

  static fetchAll() {
    // // spajam se na bazu kao test   user : 'ucimeu96_test',
    return databasePoolMysql2.execute('SELECT * FROM products');
  }

  static fetchOne(id) {
    // // spajam se na bazu kao test   user : 'ucimeu96_test',
    return databasePoolMysql2.execute('SELECT * FROM products WHERE products.id =?',[id]);
  }

};
