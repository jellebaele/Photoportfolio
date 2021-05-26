const CategoryRepository = require("../repository/CategoryRepository");
const ImageRepository = require("../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

function getIndexOverviewCategory(req, res) {
   categoryRepository.searchCategory(req.params.category)
      .then(result => {
         if (result.length > 0) {
            imageRepository.findImagesByCategory(result[0].title)
               .then(images => {
                  res.send(images);
               })
               .catch(error => res.status(500).send(error))
         } else {
            //...
         }

      })
      .catch(error => res.status(500).send(error));
}

module.exports = {
   getIndexOverviewCategory,
};