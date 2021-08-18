const CategoryRepository = require("../../repository/CategoryRepository");
const ImageRepository = require("../../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

async function deleteImage(req, res) {
    const id = req.query.id;
    try {
        if (id === undefined) throw new Error("No id was specified.");
        
        const deletedImage = await imageRepository.deleteImageById(id);
        if (deletedImage) {
            console.log(deletedImage);
            const updatedCategory = await categoryRepository.adjustAmountOfPicturesByTitle(deletedImage.category, -1);
            res.status(200).send(deletedImage);
        } else {
            res.status(400).send(`Image with id '${id}' not found and thus not deleted.`);
        }        
    } catch (error) {
        res.statusMessage = error.message;
        console.error(error.message);
        res.status(501).end();
    }
}

module.exports = {
    deleteImage
};