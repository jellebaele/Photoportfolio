const ImageModel = require("../models/Image");
const CategoryModel = require("../models/Category");

function getIndex(req, res) {
   getCategory("Thumbnail")
      .then((category) => {
         ImageModel.find({ category: category })
            .then((images) => {
               console.log(images);
               res.render("pages/index", { images: images });
            })
            .catch((error) => {
               console.log(error);
               res.status(500).send("An error occurred", error);
            });
      })
      .catch((error) => {
         console.log(error);
         res.status(500);
         res.render("pages/index", { images: [] });
      });
}

async function getCategory(categoryToBeFound) {
   try {
      const category = await CategoryModel.find({
         title: categoryToBeFound,
      }).limit(1);
      if (category.length > 0) return category[0].title;
      else throw new Error(`Category '${categoryToBeFound}' not found!`);
   } catch (error) {
      throw error;
   }
}

module.exports = {
   getIndex,
};