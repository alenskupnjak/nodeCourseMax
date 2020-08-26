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
        productId: {
          // veza 1 isto ime !!!
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
// metoda dodavanja kartice
userSchema.methods.addToCart = function (product) {
  //  prvo trazim postoji li vec ovaj atikal na listi
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
// Clear cart
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

// EXPORT EXPORT EXPORT EXPORT EXPORT EXPORT EXPORT
// mongosse automatski pretvara 'User' u mala slova =>(user), radi množinu na engleskom i kreira zapis u bazi
module.exports = mongoose.model('User', userSchema);

// verzija bez mongosse
// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
// const colors = require('colors');
// class User {
//   constructor(username, email, cart, _id, artikal) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//     this.artikal = artikal;
//   }

//   // Snimanje novog podatka u bazu
//   save() {
//     const db = getDb();
//     return db
//       .collection('users')
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // dodaj  kupovnu karticu za userakarticu
//   addToCart(product) {
//     // prvo trazim postoji li vec ovaj atikal na listi
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     console.log('cartProductIndex='.red, cartProductIndex);
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     console.log(updatedCartItems);

//     // ako je pronasao zapis..
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // prvi zapis
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     // const updatedCart = {
//     //   items: [{...product, quantity:1 }],
//     // };

//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   //
//   //
//   // pronalazim usera u bazi preko id
//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         // console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // DELETE
//   // brisanje kartice
//   deleteItemFromCart(productId) {
//     console.log(colors.green.underline(productIds));

//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });

//     // spajanje na bazu
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   // ADD ADD ADD ADD ADD
//   // Nardudžba kartice
//   addOrder() {
//     const db = getDb();
//     console.log(colors.green.inverse(this.getCart().then(data=>{
//       console.log(data);
//     })));

//     return this.getCart()
//       .then(products => {
//         // kreiramo order koji cemo ubaciti u bazu
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name
//           }
//         };

//         console.log('order=',order);

//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         // praznimo lisu narudbe
//         this.cart = { items: [] };

//         // u bazi spremamo prazni zapis u polje chart
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   //
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new mongodb.ObjectId(this._id) })
//       .toArray();
//   }

//   // GET '/cart'
//   getCart() {
//     const db = getDb();
//     console.log(this.cart.items);
//     // [   this.cart.items
//     //   { productId: 5f12cc10297741361480d024, quantity: 47 },
//     //   { productId: 5f12cdb4297741361480d025, quantity: 2 },
//     //   { productId: 5f12fd830c856743c829bfa9, quantity: 1 }
//     // ]
//     // trebam da mogu ubaciti vrijednost u ....find({ _id: { $in: productIds } })
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });

//     console.log(colors.green.underline(productIds));
//     // radim polje da dallnju obradu
//     // [   productIds
//     //   5f12cc10297741361480d024,
//     //   5f12cdb4297741361480d025,
//     //   5f12fd830c856743c829bfa9
//     // ]

//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {

//         console.log(colors.magenta.underline(products));
//         return products.map(p => {
//           // pronalazim količinu u zapisu
//           let produkt = this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           });
//           console.log('kolicina=', produkt );
//           // vracam koncnu vrijednost
//           return {...p, quantity: produkt .quantity};
//         })
//       }).then(data=>{
//         console.log(colors.blue(data));
//         return data
//       });;
//   }
// }

// module.exports = User;
