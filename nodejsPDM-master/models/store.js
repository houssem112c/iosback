const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    names: {
      type: String,
      required: true,
    },
    images: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Example minimum value
    },
    category: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  

const itemsModel = mongoose.model('store', itemSchema, 'store');

module.exports = itemsModel;