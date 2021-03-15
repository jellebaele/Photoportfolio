const router = require("express").Router();
const api = require('./api')

router.get("/home", (req, res, next) => {
  // Get all images
  /*var mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
    { name: "Tux", organization: "Linux", birth_year: 1996 },
    { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
  ];
  var tagline =
    "No programming concept is complete without a cute animal mascot.";*/

  res.render("pages/index");
});

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.use(api);

module.exports = router;