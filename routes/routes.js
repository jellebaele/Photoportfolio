const router = require("express").Router();
const apiRoute = require("./subroutes/apiRoute");
const homeRoute = require("./subroutes/homeRoute");
const adminRoute = require("./subroutes/adminRoute");
const overviewRoute = require("./subroutes/overviewRoute");

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.use("/home", homeRoute);
router.use("/overview", overviewRoute);
router.use("/admin", adminRoute);
router.use("/api", apiRoute);

module.exports = router;
