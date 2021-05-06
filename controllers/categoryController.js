const CategoryModel = require("../models/Category");

const getCategories = (req, res) => {};

const searchCategories = (req, res) => {
   const query = req.query.search;
   const limit = parseInt(req.query.limit);
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

module.exports = {
   getCategories,
   searchCategories,
};
