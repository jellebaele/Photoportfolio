const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");
const util = require("util");

const storageThumbnail = multer.diskStorage({
  destination: (req, file, callback) => {
    // If req.body.category ... set destination ...
    callback(null, path.join(`${__dirname}/../uploads/thumbnail`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `<strong>${file.originalname}</strong> is invalid. Only .png/.jpeg files are accepted`;
      return callback(message, null);
    }

    let filename = file.originalname.replace(/[*$µ£`´#^¨|]/g, "");
    callback(null, filename);
  },
});

let uploadFiles = multer({ storage: storageThumbnail }).array("files", 10);

const getIndex = (req, res) => {
  res.render("pages/upload-images");
};

const postImages = (req, res) => {
  const newImages = CreateNewImages(req);
  res.json({ images: newImages });
  res.status(200);
  res.send();
};

async function CreateNewImages(req) {
  let newImages = await req.files.forEach((image) => {
    const newImage = new Image({
      title: image.originalname,
      img: {
        path: image.path,
        mimetype: image.mimetype,
        size: image.size,
        encoding: image.encoding,
      },
      category: req.body.category,
    });

    newImage.save();
  });

  return newImages;
}

module.exports = {
  getIndex,
  postImages,
  uploadFiles,
};
