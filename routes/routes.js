const router = require("express").Router();
const uploadRoutes = require("./subroutes/uploadRoutes");
const overviewRoute = require("./subroutes/overviewRoute");

router.get("/home", (req, res, next) => {
  res.render("pages/index");
});

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.get("/overview", overviewRoute);
router.use("/api/upload", uploadRoutes);

module.exports = router;
