const express = require("express");
const ItemModel = require("../models/store");
const router = express.Router();

router.get("/get-all-items", async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.send(items);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/add-item", async (req, res) => {
    try {
      const newItem = new ItemModel(req.body);
      await newItem.save();
      res.status(201).json({ message: "Item added successfully!" });
    } catch (error) {
      if (error.name === "ValidationError") {
        // Handle validation errors
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ errors: validationErrors });
      } else {
        // Handle other types of errors
        res.status(500).json({ error: "An error occurred while adding the item" });
      }
    }
  });
  
  

router.post("/edit-item", async (req, res) => {
  try {
    await ItemModel.findOneAndUpdate({_id : req.body.itemId}, req.body)
    res.send("Item updated successfully!");
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/delete-item", async (req, res) => {
  try {
    await ItemModel.findOneAndDelete({_id : req.body.itemId})
    res.send("Item deleted successfully!");
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;