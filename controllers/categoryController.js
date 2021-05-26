const CategoryRepository = require("../repository/CategoryRepository");
const ImageRepository = require("../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

const searchCategories = (req, res) => {
   const query = req.query.search;
   let limit = parseInt(req.query.limit);

   categoryRepository.searchCategories(new RegExp('^' + query, "i"), limit)
      .then((categories) => {
         res.send(categories);
      })
      .catch((error) => {
         res.status(501).send("Error: " + error);
      });
};

async function createCategory(req, res) {
   let title = req.query.categoryTitle.replace(/[{}><*$µ£`()\´#^¨|\[\]]/gi, "");
   if (title === "") title = "undefined";

   await categoryRepository.createCategory(title)
      .then(result => {
         res.send(result);
      })
      .catch(error => {
         res.status(500).send(error);
      });
}

async function deleteCategory(req, res) {
   await categoryRepository.deleteCategory(req.query.id)
      .then(deletedCategory => res.status(200).send(deletedCategory))
      .catch(error => res.status(500).send("Failed: " + error));
}

async function patchCategoryTitle(req, res) {
   const id = req.query.id;
   const newTitle = req.query.newTitle;
   let oldCategory = await categoryRepository.searchCategoryById(id);

   await categoryRepository.updateCategoryById(id, newTitle)
      .then(updatedCategory => {
         if (oldCategory.length > 0) {
            imageRepository.updateImagesByCategory(oldCategory[0].title, newTitle)
               .then(updatedImages => {
                  res.status(200).json({
                     updatedCategory: updatedCategory,
                     updatedImages: updatedImages
                  })
               })
               .catch(error => res.status(500).json({ message: error }))
         } else {
            console.log('No objects');
            res.status(200).json({
               updatedCategory: updatedCategory,
               updatedImages: {
                  ok: 0, n: 0, nModified: 0
               }
            })
         }
      })
      // TODO Change error code
      .catch(error => res.status(500).json({ message: error }))
}

module.exports = {
   searchCategories,
   createCategory,
   deleteCategory,
   patchCategoryTitle
};
