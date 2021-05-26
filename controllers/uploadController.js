const multer = require("multer");
const path = require("path");
const CategoryModel = require("../models/Category");
const UploadControllerHelper = require("../repository/ImageRepository");

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

      let filename = file.originalname.replace(/[{}><*$µ£`()\´#^¨|\[\]]/gi, "");
      callback(null, filename);
   },
});

let uploadFiles = multer({ storage: storageThumbnail }).array("files", 10);

const getIndex = (req, res) => {
   CategoryModel.find({})
      .sort({ title: 1 })
      .limit(5)
      .then((categories) => {
         console.log(categories);
         res.render("pages/admin/upload-images", { categories: categories });
      })
      .catch((error) => {
         res.status(501).render("pages/upload-images");
      });
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

      let descriptions = req.body.descriptions.split(",");

      for (let i = 0; i < req.files.length; i++) {
         const image = req.files[i];
         await uploadHelper.SaveNewImage(image, req.body.category, newImages, descriptions[i]);
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
