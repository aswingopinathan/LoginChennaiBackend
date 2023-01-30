var express = require("express");
var router = express.Router();
const userHelpers = require("../helpers/user-helper");
var multer = require("multer");
const generateToken = require("../utils/generateToken");


router.get("/", (req, res) => {
  res.status(200).json("homepage");
});

let gmail;
router.post("/login", (req, res) => {
//   let inputName = req.body.Username;
  gmail = req.body.Email;
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      res.status(200).json({token: generateToken(response.user._id),username: response.user?.Username});
    } else {
      res.status(500).json("invalid credential");
    }
  });
});

const filestorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/product-images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

let fileFilter = function (req, file, cb) {
  var allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      {
        success: false,
        message: "Invalid file type. Only jpg, png image files are allowed.",
      },
      false
    );
  }
};

let obj = {
  storage: filestorageEngine,
  limits: {
    fileSize: 100 * 1024,
  },
  fileFilter: fileFilter,
};

const upload = multer(obj);

router.post("/add-image", upload.array("Images"), (req, res) => {
  var filenames = req.files.map(function (file) {
    return file.filename;
  });
  req.body.Images = filenames;
  req.body.Email = gmail;
  userHelpers.addImage(req.body).then((response) => {
    if (response.status) {
      res.status(200).json("image uploaded");
      console.log("image uploaded");
    } else {
      res.status(500).json("image not uploaded");
      console.log("image not uploaded");
    }
  });
});

module.exports = router;
