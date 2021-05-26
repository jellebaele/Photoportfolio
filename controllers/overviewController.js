const CategoryRepository = require("../repository/CategoryRepository")
const categoryControllerHelper = new CategoryRepository();

function getIndexOverviewCategory(req, res) {
        categoryControllerHelper.searchCategory(req.params.category)
        .then(result => console.log(result));

    res.send(req.params.category)
 }
 
 module.exports = {
    getIndexOverviewCategory,
 };