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
         throw error;
      }

   }

   async getCategoryTitleAndUpdate(categoryTitle) {
      try {
         const result = await categoryRepository.updateCategoryAmountOfPicturesByTitle(categoryTitle, 1);
         return result.updatedCategory.title;
      } catch (error) {
         throw error;
      }
   }

   async GetNewIndex() {
      try {
         const lastImageUploaded = await ImageModel.find().sort({ $natural: -1 }).limit(1);
         if (lastImageUploaded.length > 0) return lastImageUploaded[0].index + 1;
         else return 0;
      } catch (error) {
         throw error;
      }

   }

   async findImagesByCategory(categoryName, limit = 50) {
      try {
         return await ImageModel.find({ category: categoryName }).limit(limit);
      } catch (error) {
         throw error;
      }
   }

   async updateImagesByCategory(categoryName, newCategoryName) {
      const filter = { category: categoryName };
      const updateImage = {
         $set: { category: newCategoryName }
      };

      try {
         return await ImageModel.updateMany(filter, updateImage);
      } catch (error) {
         throw error;
      }
   }

   async deleteAllImagesForCategory(categoryName) {
      const filter = { category: categoryName };

      try {
         return await ImageModel.deleteMany(filter);
      } catch (error) {
         throw error;
      }
   }
}

module.exports = UploadControllerHelper;