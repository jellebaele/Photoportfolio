const router = require("express").Router();
const apiRoute = require("./subroutes/apiRoute");
const overviewRoute = require("./subroutes/overviewRoute");
const adminRoute = require("./subroutes/adminRoute");

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.use("/home", overviewRoute);
router.use("/admin", adminRoute);
router.use("/api", apiRoute);

module.exports = router;
