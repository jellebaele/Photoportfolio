const CategoryModel = require("../models/Category");

const searchCategories = (req, res) => {
   const query = req.query.search;
   let limit = parseInt(req.query.limit);
   if (limit > 50) limit = 50;
   CategoryModel.find({ title: new RegExp('^' + query, "i") })
      .limit(limit)
      .then((categories) => {
         res.send(categories);
      })
      .catch((error) => {
         res.status(501).send("Error: " + error);
      });
};

async function deleteCategory(req, res) {
   await CategoryModel.deleteOne({ _id: req.query.id })
      .then(deletedCategory => res.status(200).send(deletedCategory))
      .catch(error => res.status(500).send("Failed: " + error));
}

async function patchCategoryTitle(req, res) {
   await CategoryModel.updateOne({
      _id: req.query.id,
      $set: { title: req.query.newTitle }
   })
      .then(updatedCategory => res.status(200).json({ updatedCategory: updatedCategory }))
      // TODO Change error code
      .catch(error => res.status(500).json({ message: error }))
}

module.exports = {
   searchCategories,
   deleteCategory,
   patchCategoryTitle
};
