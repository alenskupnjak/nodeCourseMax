const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = _id
  };

   // Snimanje novog podatka u bazu
   save() {
    const db = getDb();
     return db.collection('users').insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

    // pronalazim usera u bazi preko id
    static findById(prodId) {
      const db = getDb();
      return db
        .collection('users')
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


}
module.exports = User;
