const CategoryRepository = require("../repository/CategoryRepository");
const ImageRepository = require("../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

async function getIndexOverviewCategory(req, res) {
   try {
      const category = await categoryRepository.searchCategory(req.params.category);
      if (category.length > 0) {
         const images = await imageRepository.findImagesByCategory(result[0].title);
         res.send(images);
      } else {
         //TODO
      }
   } catch (error) {
      // TODO
      console.error('overviewController: ' + error);
      res.status(500);
      res.send(error);
   }
}

module.exports = {
   getIndexOverviewCategory,
};