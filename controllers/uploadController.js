const multer = require("multer");
const path = require("path");
const ImageRepository = require("../repository/ImageRepository");
const CategoryRepository = require("../repository/CategoryRepository");
const imageRepository = new ImageRepository();
const categoryRepository = new CategoryRepository();

const storageThumbnail = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, path.join(`${__dirname}/../uploads/categories/${req.body.category}`));
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
   res.render("pages/admin/upload-images");
};

const postImages = (req, res) => {
   try {
      const newImages = SaveNewImages(req);
      res.status(200).json({ images: newImages });
   } catch (error) {
      res.status(501).send();
   }
};

async function SaveNewImages(req) {
   try {
      let newImages = [];
      let descriptions = req.body.descriptions.split(",");

      for (let i = 0; i < req.files.length; i++) {
         const image = req.files[i];
         await imageRepository.SaveNewImage(image, req.body.category, newImages, descriptions[i]);
      }
      return newImages;
   } catch (error) {
      console.log("Something went wrong " + error);
      return error;
   }
}

async function createNewCategoryIfNeeded(req, res, next) {
   await categoryRepository.createCategory(req.query.categoryTitle)
      .then(() => next())
      .catch(error => {
         console.log(error);
         res.send(error)
      })
}

module.exports = {
   getIndex,
   postImages,
   uploadFiles,
   createNewCategoryIfNeeded
};
