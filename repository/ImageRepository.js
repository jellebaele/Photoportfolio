const fs = require('fs');
const ImageModel = require("../models/Image");
const CategoryRepository = require("./CategoryRepository");
const categoryRepository = new CategoryRepository();

class UploadControllerHelper {
   async SaveNewImage(image, resizedImage, categoryTitle, description, newImages) {
      try {
         const newImage = new ImageModel({
            title: image.originalname,
            img: {
               path_original: "uploads" + image.path.split("uploads")[1],
               path_resized: "uploads" + resizedImage.path.split("uploads")[1],
               mimetype: image.mimetype,
               size: image.size,
               encoding: image.encoding,
            },
            category: await this.getCategoryTitleAndUpdate(categoryTitle),
            description: description,
            index: await this.GetNewIndex(categoryTitle),
         });
         newImages.push(newImage);
         await newImage.save();
      } catch (error) {
         throw error;
      }

   }

   async getCategoryTitleAndUpdate(categoryTitle) {
      try {
         const result = await categoryRepository.adjustAmountOfPicturesByTitle(categoryTitle, 1);
         return result.updatedCategory.title;
      } catch (error) {
         throw error;
      }
   }

   async GetNewIndex(categoryTitle) {
      try {
         const lastImageUploaded = await ImageModel.find({ category: categoryTitle }).sort({ $natural: -1 }).limit(1);
         if (lastImageUploaded.length > 0) return lastImageUploaded[0].index + 1;
         else return 0;
      } catch (error) {
         throw error;
      }

   }

   async findImageById(id, limit = 50, filter) {
      try {
         if (limit !== -1) {
            return await ImageModel.findById(id).limit(limit);
         } else {
            return await ImageModel.findById(id);
         }
      } catch (error) {
         throw error;
      }
   }

   async findImagesByCategory(categoryName, limit = 50, filter) {
      try {
         let defaultFilter = { category: categoryName };

         if (typeof filter !== 'undefined') defaultFilter = filter;

         if (limit !== -1) {
            return await ImageModel.find(defaultFilter).limit(limit);
         } else {
            return await ImageModel.find(defaultFilter);
         }
      } catch (error) {
         throw error;
      }
   }

   async findImagesByCategoryAndIndex(categoryName, limit = 50, index, isIncremental = true) {
      let filter;
      if (isIncremental) filter = { category: categoryName, index: { $gt: index } }
      else filter = { category: categoryName, index: { $lt: index } }

      return await this.findImagesByCategory(categoryName, limit, filter);
   }

   async updateImagesByCategory(oldCategoryName, newCategoryName) {
      try {
         const imagesToBeUpdated = await this.findImagesByCategory(oldCategoryName, -1);
         imagesToBeUpdated.forEach(async (image, i) => {
            image.img.path_original = image.img.path_original.replace(`\\categories\\${oldCategoryName}`, `\\categories\\${newCategoryName}`);
            image.img.path_resized = image.img.path_resized.replace(`\\categories\\${oldCategoryName}`, `\\categories\\${newCategoryName}`);
            await image.save();
         });

         const filter = { category: oldCategoryName };
         const updateImage = {
            $set: {
               category: newCategoryName,
            }
         };
         return await ImageModel.updateMany(filter, updateImage);
      } catch (error) {
         throw error;
      }
   }

   async updateImageIndexById(id, newIndex) {
      try {
         let imageToBeUpdated = await this.findImageById(id);
         imageToBeUpdated.index = newIndex;
         return await imageToBeUpdated.save();
      } catch (error) {
         throw error;
      }
   }

   async deleteImageById(id) {
      try {
         const image = await ImageModel.findById(id);
         const category = image.category;
         const index = image.index;
         await this.deleteImageInDirectory(image.img.path_original, image.img.path_resized);
         const deletedImage = await ImageModel.deleteOne(image);
         return { deletedImage: deletedImage, category: category, index: index }
      } catch (error) {
         console.error(error);
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

   async deleteImageInDirectory(pathOriginal, pathResized) {
      await fs.unlink(pathOriginal, (err) => {
         if (err) throw err;
         return;
      });

      await fs.unlink(pathResized, (err) => {
         if (err) throw err;
         return;
      });
   }
}

module.exports = UploadControllerHelper;