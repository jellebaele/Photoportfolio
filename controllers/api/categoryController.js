const CategoryRepository = require("../../repository/CategoryRepository");
const ImageRepository = require("../../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

async function searchCategories(req, res) {
   let query = req.query.search;
   if (query === undefined) query = "";
   let limit = parseInt(req.query.limit);

   try {
      const categories = await categoryRepository.searchByTitle(new RegExp('^' + query, "i"), limit);
      res.send(categories);
   } catch (error) {
      res.statusMessage = error.message;
      console.error(error);
      res.status(501).end();
   }
};

async function createCategory(req, res) {
   let title = req.query.categoryTitle.replace(/[{}><*$µ£`()\´#^¨|\[\]]/gi, "");
   if (title === "") title = "undefined";

   try {
      const result = await categoryRepository.create(title);
      res.status(201).send(result);
   } catch (error) {
      res.statusMessage = error.message;
      console.error(error.message);
      res.status(501).end();
   }
}

async function deleteCategory(req, res) {
   const id = req.query.id;

   try {
      const categoryToBeDeleted = await categoryRepository.searchById(id);
      if (categoryToBeDeleted.length > 0) {
         await imageRepository.deleteAllImagesForCategory(categoryToBeDeleted[0].title);
      }
      const deletedCategory = await categoryRepository.deleteById(id);
      res.status(200).send(deletedCategory);
   } catch (error) {
      res.statusMessage = error.message;
      console.error(error.message);
      res.status(501).end();
   }
}

async function patchCategoryTitle(req, res) {
   const id = req.query.id;
   const newTitle = req.query.newTitle;
   try {
      const oldCategory = await categoryRepository.searchById(id);

      if (oldCategory.length > 0) {
         const updatedCategory = await categoryRepository.updateCategoryTitleById(id, newTitle);
         const updatedImages = await imageRepository.updateImagesPathByCategory(oldCategory[0].title, newTitle);

         res.status(201).send({ updatedCategory: updatedCategory, updatedImages: updatedImages });
      } else {
         throw new Error("Category to be renamed does not exist");
      }
   } catch (error) {
      res.statusMessage = error.message;
      console.error(error.message);
      res.status(501).end();
   }
}

module.exports = {
   searchCategories,
   createCategory,
   deleteCategory,
   patchCategoryTitle
};
