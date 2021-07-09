const multer = require("multer");
const ImageRepository = require("../repository/ImageRepository");
const CategoryRepository = require("../repository/CategoryRepository");
const ImageResizer = require("./upload/ImageResizer");
const storage = require("../configuration/multerStorage");

const imageRepository = new ImageRepository();
const categoryRepository = new CategoryRepository();
const imageResizer = new ImageResizer();

const getIndex = (req, res) => {
   res.render("pages/admin/upload-images");
};

async function postImages(req, res) {
   try {
      const images = req.files;
      const category = req.body.category;
      const descriptions = req.body.descriptions.split(",");

      const resizedImages = await imageResizer.resizeMultipleImages(images, category, 240, 'contain');
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

async function uploadFiles(req, res, next) {
   MulterUploadFiles(req, res, function (error) {
      if (error) {
         res.statusMessage = error.message;
         console.error(error);
         res.status(501).end();
      }
      next();
   })
}

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

async function saveImagesInDb(images, resizedImages, category, descriptions)
{
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

const MulterUploadFiles = multer({ storage: storage }).array("files", 10);

module.exports = {
   getIndex,
   postImages,
   uploadFiles,
   createNewCategoryIfNeeded
};
