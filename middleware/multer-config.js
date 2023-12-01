const multer = require('multer');
const { diskStorage } = require('multer');
const { join, dirname } = require('path');
const { fileURLToPath } = require('url');

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

module.exports = function (image, size) {
  return multer({
    storage: diskStorage({
      destination: function(req, file, callback) {
        const __dirname = dirname(fileURLToPath(require.main.filename));
        callback(null, join(__dirname, "../public/images"));
      },
      filename: function(req, file, callback) {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
      },
    }),
    limits: size,
  }).single(image);
};
