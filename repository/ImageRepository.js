const fs = require('fs');
const ImageModel = require("../models/Image");
const CategoryRepository = require("./CategoryRepository");
const categoryRepository = new CategoryRepository();

class UploadControllerHelper {
   async SaveNewImage(image, categoryTitle, newImages, description) {
      try {
         const newImage = new ImageModel({
            title: image.originalname,
            img: {
               path: "uploads" + image.path.split("uploads")[1],
               mimetype: image.mimetype,
               size: image.size,
               encoding: image.encoding,
            },
            category: await this.getCategoryTitleAndUpdate(categoryTitle),
            description: description,
            index: await this.GetNewIndex(),
         });
         newImages.push(newImage);
         await newImage.save();
      } catch (error) {
         throw new Error(error)
      }

   }

   async getCategoryTitleAndUpdate(categoryTitle) {
      return new Promise((resolve, reject) => {
         categoryRepository.updateCategoryAmountOfPicturesByTitle(categoryTitle, 1)
            .then(result => {
               resolve(result.updatedCategory.title)
            })
            .catch(error => {
               reject(error)
            })
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

   async updateImagesByCategory(categoryName, newCategoryName) {
      return new Promise((resolve, reject) => {
         const filter = { category: categoryName };
         const updateImage = {
            $set: { category: newCategoryName }
         };

         ImageModel.updateMany(filter, updateImage)
            .then(updatedImages => {
               resolve(updatedImages)
            })
            .catch(error => reject(error))
      })
   }

   async deleteAllImagesForCategory(categoryName) {
      return new Promise((resolve, reject) => {
         const filter = { category: categoryName };
         
         ImageModel.deleteMany(filter)
            .then(deletedImages => {
               resolve(deletedImages);
            })
            .catch(error => reject(error))
      })
   }
}

module.exports = UploadControllerHelper;
