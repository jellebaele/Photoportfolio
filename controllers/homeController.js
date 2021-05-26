const CategoryRepository = require("../repository/CategoryRepository");
const ImageRepository = require("../repository/ImageRepository")
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

function getIndex(req, res) {
   categoryRepository.searchCategory("Thumbnail")
      .then(category => {
         if (category.length > 0) {
            imageRepository.findImagesByCategory(category[0].title)
               .then((images) => {
                  res.render("pages/index", { images: images });
               })
               .catch((error) => {
                  console.log(error);
                  res.status(500).send("An error occurred", error);
               });
         }
      })
      .catch((error) => {
         console.log(error);
         res.status(500);
         res.render("pages/index", { images: [] });
      });
}

module.exports = {
   getIndex,
};