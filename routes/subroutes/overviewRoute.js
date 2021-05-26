const router = require("express").Router();
const overviewController = require('../../controllers/overviewController');

router.get("/:category", overviewController.getIndexOverviewCategory);

module.exports = router;