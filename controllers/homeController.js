const CategoryRepository = require("../repository/CategoryRepository");
const ImageRepository = require("../repository/ImageRepository")
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

async function getIndex(req, res) {
   try {
      const category = await categoryRepository.searchCategoryByTitle("Thumbnail");

      if (category.length > 0) {
         const images = await imageRepository.findImagesByCategory(category[0].title);
         res.render("pages/index", { images: images });
      } else {
         res.render("pages/index", { images: [] });
      }
   } catch (error) {
      console.error('HomeController: ' + error);
      res.status(500);
      res.render("pages/index", { images: [] });
   }
}

module.exports = {
   getIndex,
};