const getIndex = (req, res) => {
    res.render("pages/upload-images");
}

const postImages = (req, res) => {
    // Use multer to upload -> req.file will work with right name!
    console.log(req.file);
}

module.exports = {
    getIndex,
    postImages
}