const getIndex = (req, res) => {
    res.render("pages/upload-images");
}

const postImages = (req, res) => {
    console.log(req);
}

module.exports = {
    getIndex,
    postImages
}