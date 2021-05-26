const CategoryControllerHelper = require("../repository/CategoryRepository")

function getIndexOverviewCategory(req, res) {
    const categoryControllerHelper = new CategoryControllerHelper();

    categoryControllerHelper.searchCategory(req.params.category)
        .then(result => console.log(result));

    res.send(req.params.category)
 }
 
 module.exports = {
    getIndexOverviewCategory,
 };