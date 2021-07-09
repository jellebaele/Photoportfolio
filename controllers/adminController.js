const CategoryRepository = require("../repository/CategoryRepository");
const ImageRepository = require("../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

function getIndexCategories(req, res) {
   res.render("pages/admin/categories");
}

async function getEditCategory(req, res) {
   try {
      const category = await categoryRepository.searchByTitle(req.params.category, 1);
      if (category.length > 0) {
         const images = await imageRepository.findImagesByCategory(category[0].title);
         res.render("pages/admin/category-editor", { categoryTitle: category[0].title, images: images });
      } else {
         //TODO
      }
   } catch (error) {
      console.error('overviewController: ' + error);
      res.status(500);
      res.send(error);
   }
}
 
module.exports = {
   getIndexCategories,
   getEditCategory
};