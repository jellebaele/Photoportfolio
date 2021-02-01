const express = require("express");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  var mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
    { name: "Tux", organization: "Linux", birth_year: 1996 },
    { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
  ];
  var tagline =
    "No programming concept is complete without a cute animal mascot.";

  res.render("pages/index", {
    mascots: mascots,
    tagline: tagline,
  });
});

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.get("/upload", (req, res, next) => {
    res.render("pages/upload");
});

module.exports = router;
