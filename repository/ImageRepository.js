const ImageModel = require("../models/Image");
const CategoryControllerHelper = require("./CategoryRepository");

class UploadControllerHelper {
   async SaveNewImage(image, categoryTitle, newImages, description) {
      const newImage = new ImageModel({
         title: image.originalname,
         img: {
            path: "uploads" + image.path.split("uploads")[1],
            mimetype: image.mimetype,
            size: image.size,
            encoding: image.encoding,
         },
         category: await this.createOrUpdateCategoryByTitle(categoryTitle),
         description: description,
         index: await this.GetNewIndex(),
      });
      newImages.push(newImage);
      await newImage.save();
   }

   async createOrUpdateCategoryByTitle(categoryTitle) {
      let categoryControllerHelper = new CategoryControllerHelper();

      return new Promise((resolve, reject) => {
         categoryControllerHelper.createOrUpdateCategory(categoryTitle, 1)
            .then(categoryTitle => {
               resolve(categoryTitle)
            })
            .catch(error => reject(error))
      });
   }

   async GetNewIndex() {
      return new Promise((resolve, reject) => {
         ImageModel.find()
            .sort({ $natural: -1 })
            .limit(1)
            .then((result) => {
               if (result.length > 0) resolve(result[0].index + 1);
               else resolve(0);
            })
            .catch((error) => reject(error));
      });
   }

   async findImagesByCategory(categoryName, limit = 50) {
      return new Promise((resolve, reject) => {
         ImageModel.find({ category: categoryName })
            .limit(limit)
            .then((images) => {
               resolve(images);
            })
            .catch((error) => {
               reject(error);
            });
      })
   }
}

module.exports = UploadControllerHelper;
