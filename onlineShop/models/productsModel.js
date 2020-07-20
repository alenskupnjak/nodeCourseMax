const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    // this._id = id ? new mongodb.ObjectId(id) : null;
    this._id = new mongodb.ObjectId(id);
    this.userId = userId;
  }

  // Snimanje novog podatka u bazu
  save() {
    const db = getDb();
     return db.collection('products').insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // update proizvoda
  update() {
    const db = getDb();
    return db
      .collection('products')
      .updateOne({ _id: this._id }, { $set: this })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  // dohvaćanje svih proizvoda
  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        // console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // pronalazim Proizvod u bazi preko id
  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // brisanje zapisa
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log('Deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
