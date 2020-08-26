const colors = require('colors');
const mongoose = require('mongoose');

// definiremao schemu, constructor
const Schema = mongoose.Schema;

//definicija izgleda zapisa
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordTemp: {
    type: String,
  },
  name: {
    type: String,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        // ovdje je veza sa productModel!!
        productId: { // veza 1 isto ime !!!
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true }, // veza 2 isto ime !!!
      },
    ],
  },
});

////////////////////////////////////
// ADD METHOD
// metoda dodavanja cart
userSchema.methods.addToCart = function (product) {
  //  prvo trazim postoji li vec ovaj atikal na listi kod trenutnog usera
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  // stvaram kopiju polja
  const updatedCartItems = [...this.cart.items];

  // ako je pronasao zapis vec postoji u bazi..
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // prvi zapis
    updatedCartItems.push({
      productId: product._id, // veza 1 isto ime !!!
      quantity: newQuantity, // veza 2 isto ime !!!
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

//
////////////////////////////////////
// DELETE cart
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

////////////////////////////////////
// CLEAR cart
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

// EXPORT EXPORT EXPORT EXPORT EXPORT EXPORT EXPORT
// mongosse automatski pretvara 'User' u mala slova =>(user), radi množinu na engleskom i kreira zapis u bazi
module.exports = mongoose.model('User', userSchema);