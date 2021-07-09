const multer = require("multer");
const ImageRepository = require("../repository/ImageRepository");
const CategoryRepository = require("../repository/CategoryRepository");
const ImageResizer = require("./upload/ImageResizer");
const storage = require("../configuration/multerStorage");

const imageRepository = new ImageRepository();
const categoryRepository = new CategoryRepository();
const imageResizer = new ImageResizer();

const MULTER_UPLOAD_ARRAY_NAME = 'files';
const RESIZE_WIDTH = 240;
const RESIZE_FIT = 'contain';

const getIndex = (req, res) => {
   res.render("pages/admin/upload-images");
};

async function createNewCategoryIfNeeded(req, res, next) {
   try {
      await categoryRepository.create(req.query.categoryTitle)
      next();
   } catch (error) {
      res.statusMessage = error.message;
      console.error(error);
      res.status(501).end();
   }
}

async function uploadFilesToDirectory(req, res, next) {
   MulterUploadFiles(req, res, function (error) {
      if (error) {
         res.statusMessage = error.message;
         console.error(error);
         res.status(501).end();
      }
      next();
   })
}

const MulterUploadFiles = multer({ storage: storage }).array(MULTER_UPLOAD_ARRAY_NAME, 10);

async function resizeAndPostImagesInDb(req, res) {
   try {
      const images = req.files;
      const category = req.body.category;
      const descriptions = req.body.descriptions.split(",");

      const resizedImages = await imageResizer.resizeMultipleImages(images, category, RESIZE_WIDTH, RESIZE_FIT);
      const storedImages = await saveImagesInDb(images, resizedImages, category, descriptions);

      if (storedImages.length < 1) {
         throw new Error(`Attempt to upload ${storedImages.length} image(s). Select one or more images to upload`)
      }
      res.status(201).json({ images: storedImages, amount: storedImages.length, category: category });

   } catch (error) {
      res.statusMessage = error.message;
      console.error(error);
      res.status(400).end();
   }
}

async function saveImagesInDb(images, resizedImages, category, descriptions) {
   try {
      let newImages = [];
      for (let i = 0; i < images.length; i++) {
         await imageRepository.SaveNewImage(images[i], resizedImages[i], category, descriptions[i], newImages);
      }
      return newImages;
   } catch (error) {
      throw error;
   }
}

module.exports = {
   getIndex,
   createNewCategoryIfNeeded,
   uploadFilesToDirectory,
   resizeAndPostImagesInDb   
};
