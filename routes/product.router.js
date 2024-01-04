const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { getAll, add, update, remove } = require('../controllers/product.controller');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Use Date.now() to make sure that filenames are unique
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.route('/').get(getAll).post(
    upload.single('image'), // 'image' is the field name in your form
    body('ProductName').isString(),
    add
);

router.route('/:id').put(
    upload.single('image'), // 'image' is the field name in your form
    update
).delete(remove);

module.exports = router;
