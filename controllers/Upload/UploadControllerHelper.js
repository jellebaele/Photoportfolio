const ImageModel = require("../../models/Image");
const CategoryModel = require("../../models/Category");

class uploadControllerHelper {
   async SaveNewImage(image, category, newImages) {
      const newImage = new ImageModel({
         title: image.originalname,
         img: {
            path: image.path,
            mimetype: image.mimetype,
            size: image.size,
            encoding: image.encoding,
         },
         category: await this.UpdateOrCreateCategory(category),
         index: await this.GetNewIndex(),
      });
      newImages.push(newImage);
      await newImage.save();
   }

   async UpdateOrCreateCategory(category) {
      return new Promise((resolve, reject) => {
         CategoryModel.find({ title: category })
            .limit(1)
            .then((result) => {
               if (result.length < 1) {
                  const newCategory = this.CreateNewCategory(category);
                  resolve(newCategory.title);
               } else {
                  this.UpdateCategory(category, result[0].amountOfPictures)
                     .then(() => resolve(result[0].title))
                     .catch((error) => reject(error));
               }
            })
            .catch((error) => reject(error));
      });
   }

   async CreateNewCategory(category) {
      const newCategory = new CategoryModel({
         title: category,
         amountOfPictures: 1,
      });
      await newCategory.save();
      return newCategory;
   }

   async UpdateCategory(category, amountOfPictures) {
      const filter = { title: category };
      const updateCategory = {
         $set: {
            amountOfPictures: ++amountOfPictures,
         },
      };
      return await CategoryModel.updateOne(filter, updateCategory);
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
}

module.exports = uploadControllerHelper;
