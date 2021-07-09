const multer = require("multer");
const sharp = require("sharp");
const ImageRepository = require("../repository/ImageRepository");
const CategoryRepository = require("../repository/CategoryRepository");
const UploadDirectory = require("../general/UploadDirectory");
const storage = require("../configuration/multerStorage");

const imageRepository = new ImageRepository();
const categoryRepository = new CategoryRepository();

const getIndex = (req, res) => {
   res.render("pages/admin/upload-images");
};

async function postImages(req, res) {

   try {
      const images = req.files;
      const category = req.body.category;
      const descriptions = req.body.descriptions.split(",");

      const resizedImages = await resizeMultipleImages(images, category);
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

async function resizeMultipleImages(images, category) {
   return new Promise(async (resolve, reject) => {
      if (!images) reject("No images");

      const resizedImages = images.map(image => resizeSingleImage(image, category));

      Promise.all(resizedImages)
         .then(resizedImages => resolve(resizedImages))
         .catch(error => reject(error))
   });
}

async function resizeSingleImage(image, category) {
   return new Promise(async (resolve, reject) => {
      const uploadPath = UploadDirectory.getResizedImageDirectoryWithImageTitle(category, image.filename)

      await sharp(image.path)
         .resize({
            width: 240,
            fit: 'contain'
         })
         .jpeg({ quality: 90 })
         .toFile(uploadPath)
         .then(resized => {
            resized.category = category;
            resized.path = uploadPath;
            resolve(resized);
         })
         .catch(error => reject(error));
   });
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
