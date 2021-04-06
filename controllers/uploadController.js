const multer = require("multer");
const path = require("path");
const util = require("util");

const storageThumbnail = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("destination r");
    callback(null, path.join(`${__dirname}/../uploads/thumbnail`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    console.log("start filename");
    if (match.indexOf(file.mimetype) === -1) {
      console.log("destination r - error");
      var message = `<strong>${file.originalname}</strong> is invalid. Only .png/.jpeg files are accepted`;
      return callback(message, null);
    }

    let filename = `${file.originalname}`;
    console.log("filename set");
    callback(null, filename);
  },
});

// let uploadFiles = multer({ storage: storageThumbnail }).array("selectedFilesTag", 10);
let uploadFiles = multer({ storage: storageThumbnail }).array("files", 10);


const getIndex = (req, res) => {
  res.render("pages/upload-images");
};

const postImages = (req, res) => {
    res.status(200);
    res.send();
};

module.exports = {
  getIndex,
  postImages,
  uploadFiles,
};
