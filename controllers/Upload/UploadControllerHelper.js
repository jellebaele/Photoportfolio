const ImageModel = require("../../models/Image");
const CategoryControllerHelper = require("../Category/CategoryControllerHelper");

class UploadControllerHelper {
   async SaveNewImage(image, category, newImages, description) {
      const newImage = new ImageModel({
         title: image.originalname,
         img: {
            path: "uploads" + image.path.split("uploads")[1],
            mimetype: image.mimetype,
            size: image.size,
            encoding: image.encoding,
         },
         category: await this.UpdateOrCreateCategory(category),
         description: description,
         index: await this.GetNewIndex(),
      });
      newImages.push(newImage);
      await newImage.save();
   }

   async UpdateOrCreateCategory(category) {
      let categoryControllerHelper = new CategoryControllerHelper();

      return new Promise((resolve, reject) => {
         categoryControllerHelper.createOrUpdateCategory(category, 1)
            .then(category => resolve(category.title))
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
}

module.exports = UploadControllerHelper;
