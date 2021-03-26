const multer = require("multer");
const path = require("path");
const util = require("util");

const storageThumbnail = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../uploads/thumbnail`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `<strong>${file.originalname}</strong> is invalid. Only .png/.jpeg files are accepted`;
      return callback(message, null);
    }

    let filename = `${file.originalname}`;
    callback(null, filename);
  },
});

let uploadFiles = multer({ storage: storageThumbnail }).array("myfile", 10);

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
