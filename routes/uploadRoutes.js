const router = require("express").Router();
const uploadController = require('../controllers/uploadController')

router.get("/", uploadController.getIndex);
router.post("/", uploadController.uploadFiles, uploadController.postImages)

module.exports = router;