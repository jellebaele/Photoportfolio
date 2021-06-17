const multer = require("multer");
const path = require("path");
const ImageRepository = require("../repository/ImageRepository");
const CategoryRepository = require("../repository/CategoryRepository");
const imageRepository = new ImageRepository();
const categoryRepository = new CategoryRepository();

const getIndex = (req, res) => {
   res.render("pages/admin/upload-images");
};

async function postImages(req, res) {
   try {
      const newImages = await SaveNewImages(req);
      if (newImages.length < 1) {
         throw new Error (`Attempt to upload ${newImages.length} image(s). Select one or more images to upload`)
      } 
      res.status(201).json({ images: newImages, amount: newImages.length, category: newImages[0].category });
   } catch (error) {
      res.statusMessage = error.message;
      res.status(400).end();
   }
};

const uploadFiles = (req, res, next) => {
   MulterUploadFiles(req, res, function(error) {
      if (error) {
         res.statusMessage = error.message;
         res.status(501).end();
      }
      next();
   })
}

async function createNewCategoryIfNeeded(req, res, next) {
   await categoryRepository.createCategory(req.query.categoryTitle)
      .then(() => next())
      .catch(error => {
         res.send(error)
      })
}

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
      throw new Error (error.message);
   }
}

const storageThumbnail = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, path.join(`${__dirname}/../uploads/categories/${req.body.category}`));
   },
   filename: (req, file, callback) => {
      const match = ["image/png", "image/jpeg"];
      if (match.indexOf(file.mimetype) === -1) {
         return callback(new Error(`'${file.originalname}' is invalid. Only .png/.jpeg files are accepted`), null);
      }

      let filename = file.originalname.replace(/[{}><*$µ£`()\´#^¨|\[\]]/gi, "");
      callback(null, filename);
   },
});

const MulterUploadFiles = multer({ storage: storageThumbnail }).array("files", 10);

module.exports = {
   getIndex,
   postImages,
   uploadFiles,
   createNewCategoryIfNeeded
};
