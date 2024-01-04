const express = require("express");
const multer = require("../middleware/multer-config");

const { addproject, allProject } = require("../controllers/blog");

const router = express.Router();

router.post("/addproject", multer, addproject);

router.get("/allProject", allProject);


module.exports = router;
