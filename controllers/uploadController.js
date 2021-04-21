const multer = require("multer");
const path = require("path");
const ImageModel = require("../models/Image");
const CategoryModel = require("../models/Category");
const { resolve } = require("path");
const UploadControllerHelper = require("./Upload/UploadControllerHelper");

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
      const newImages = SaveNewImages(req);
      res.json({ images: newImages });
      res.status(200).send();
   } catch (error) {
      res.status(501).send();
   }
};

async function SaveNewImages(req) {
   try {
      let newImages = [];
      let uploadHelper = new UploadControllerHelper();

      for (const image of req.files) {
         await uploadHelper.SaveNewImage(image, req.body.category, newImages);
      }

      return newImages;
   } catch (error) {
      console.log("Something went wrong " + error);
      return error;
   }
}

module.exports = {
   getIndex,
   postImages,
   uploadFiles,
};
