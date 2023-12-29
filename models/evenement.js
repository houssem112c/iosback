// models/evenement.js
const mongoose = require("mongoose");

const evenementSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  textwhats: {
    type: String,
    required: false,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  isFavorites: { type: Boolean, default: false },

 imageURL: {
    type: String,
    
  },
});
const Evenement = mongoose.model("Evenement", evenementSchema ,"evenement" );

module.exports = Evenement;
