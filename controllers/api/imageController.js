const CategoryRepository = require("../../repository/CategoryRepository");
const ImageRepository = require("../../repository/ImageRepository");
const categoryRepository = new CategoryRepository();
const imageRepository = new ImageRepository();

async function getImage(req, res) {
    const id = req.query.id;
    try {
        if (id === undefined) throw new Error("No id was specified.");

        const image = await imageRepository.findImageById(id);
        if (image) {
            res.status(200).send(image);
        } else {
            res.status(400).send(`Image with id '${id}' not found.`);
        }
    } catch (error) {
        res.statusMessage = error.message;
        console.error(error.message);
        res.status(501).end();
    }
}

async function deleteImage(req, res) {
    const id = req.query.id;
    try {
        if (id === undefined) throw new Error("No id was specified.");

        const deletedImage = await imageRepository.deleteImageById(id);
        if (deletedImage) {
            updateIndexImagesUponDelete(deletedImage.category, deletedImage.index)
            const updatedCategory = await categoryRepository.adjustAmountOfPicturesByTitle(deletedImage.category, -1);
            res.status(200).send({ deletedImage: deletedImage, updatedCategory: updatedCategory });
        } else {
            res.status(400).send(`Image with id '${id}' not found and thus not deleted.`);
        }
    } catch (error) {
        res.statusMessage = error.message;
        console.error(error.message);
        res.status(501).end();
    }
}

async function updateIndexImagesUponDelete(categoryTitle, index) {
    const images = await imageRepository.findImagesByCategoryAndIndex(categoryTitle, -1, index);
    images.forEach(image => {
        imageRepository.updateImageIndexById(image.id, image.index - 1);
    });
}

async function patchImage(req, res) {
    const id = req.query.id;
    const newTitle = req.body.title;
    const newCategory = req.body.category;
    const newDescription = req.body.description;

    try {
        if (id === undefined) throw new Error("No id was specified.");

        const updateStatus = await imageRepository.updateImageById(id, newTitle, newCategory, newDescription);
        const updatedImage = await imageRepository.findImageById(id);
        res.status(201).send({status: updateStatus, updatedImage: updatedImage});
    } catch (error) {
        res.statusMessage = error.message;
        console.error(error.message);
        res.status(501).end();
    }
}
module.exports = {
    getImage,
    deleteImage,
    patchImage
};