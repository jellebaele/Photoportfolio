const CategoryModel = require("../models/Category");

const getCategories = (req, res) => {};

const searchCategories = (req, res) => {
   const query = req.body.searchQuery;
   console.log(query);
   CategoryModel.find({ title: new RegExp('^' + query, "i") })
      .limit(5)
      .then((categories) => {
         res.send(categories);
      })
      .catch((error) => {
         res.status(501).send("Error: " + error);
      });
};

module.exports = {
   getCategories,
   searchCategories,
};
