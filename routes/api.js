const router = require("express").Router();

router.get("/api/upload", (req, res) => {
  res.render("pages/upload");
});

module.exports = router;