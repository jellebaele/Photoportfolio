const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");
const util = require("util");
const { rejects } = require("assert");

const storageThumbnail = multer.diskStorage({
  destination: (req, file, callback) => {
    // If req.body.category ... set destination ...
    // Enum maken en vergelijken met req.body.category
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
  try {
    const newImages = CreateNewImages(req);
    res.json({ images: newImages });
    res.status(200);
    res.send();
  } catch (error) {
    res.status(501);
    res.send();
  }
};

async function CreateNewImages(req) {
  try {
    let newImages = [];
    for (const image of req.files) {
      const newImage = new Image({
        title: image.originalname,
        img: {
          path: image.path,
          mimetype: image.mimetype,
          size: image.size,
          encoding: image.encoding,
        },
        category: req.body.category,
        index: await getNewIndex()
      });
      newImages.push(newImage);
      await newImage.save();
    }
    return newImages;
  } catch (error) {
    console.log("Something went wrong " + error);
    return error;
  }
}

async function getNewIndex() {
  return new Promise((resolve, reject) => {
    Image.find()
      .sort({ $natural: -1 })
      .limit(1)
      .then((result) => {
        if (result.length > 0) resolve(result[0].index + 1);
        else resolve(0);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getNewImageIndex() {
  return new Promise((resolve, reject) => {
    lastAddedImage = Image.find()
      .limit(1)
      .sort({ $natural: -1 })
      .then(
        (result) => {
          if (result.length === 1) resolve(99);
          else resolve(0);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

module.exports = {
  getIndex,
  postImages,
  uploadFiles,
};
