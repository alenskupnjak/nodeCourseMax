const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  // Snimanje novog podatka u bazu
  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // dodaj  kupovnu karticu za userakarticu
  addToCart(product) {
    // prvo trazim postoji li vec ovaj atikal na listi
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    console.log('cartProductIndex='.red, cartProductIndex);
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    // ako je pronasao zapis..
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    
    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
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
