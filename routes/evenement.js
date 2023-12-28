// routes/evenement.js
const express = require("express");
const router = express.Router();
const Evenement = require("../models/evenement");
const evenementController = require('../controllers/evenementController');
const uploadImage = require('../middleware/upload-image');

// Create a new evenement
router.post("/evenement",uploadImage, evenementController.addevenement);
router.get('/evenements/search/:query', evenementController.searchEvenements);
// Get all evenements
router.get("/evenements", evenementController.getAllevenements);

// Get a specific evenement by ID
router.get("/evenements/:id", evenementController.getSingleevenements);

// Update an evenement by ID
router.put("/evenements/:id", uploadImage, evenementController.updateevenement);

// Delete an evenement by ID
router.delete("/evenements/:id", evenementController.deleteevenement);

router.get('/evenement/allLikedEvenement', evenementController.fetchAllLikedEvenements);

router.patch('/evenement/:evenementId/togglefavorites', evenementController.toggleFavoritesStatus);
module.exports = router;
