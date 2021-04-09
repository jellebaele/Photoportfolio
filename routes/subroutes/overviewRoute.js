const router = require("express").Router();
const overviewController = require('../../controllers/overviewController')

router.get("/", overviewController.getIndex)
//router.get("/", uploadController.getIndex);
//router.post("/", uploadController.uploadFiles, uploadController.postImages)

module.exports = router;