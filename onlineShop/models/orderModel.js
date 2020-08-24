const colors = require('colors');
const mongoose = require('mongoose');

// definiremao schemu, constructor
const Schema = mongoose.Schema;

//definicija izgleda zapisa
const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
});

module.exports = mongoose.model('Order', orderSchema);
