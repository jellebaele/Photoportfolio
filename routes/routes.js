const router = require("express").Router();
const uploadRoutes = require('./uploadRoutes')

router.get("/home", (req, res, next) => {
  res.render("pages/index");
});

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.use("/api/upload", uploadRoutes);

module.exports = router;