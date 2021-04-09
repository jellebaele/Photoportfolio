const router = require("express").Router();
const uploadRoutes = require("./subroutes/uploadRoutes");
const overviewRoute = require("./subroutes/overviewRoute");

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.use("/home", overviewRoute);
router.use("/api/upload", uploadRoutes);

module.exports = router;
