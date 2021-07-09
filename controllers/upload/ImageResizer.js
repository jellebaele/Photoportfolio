const sharp = require('sharp');
const uploadDirectory = require('../../configuration/uploadDirectory');

class ImageResizer {
    async resizeSingleImage(image, category, width = 240, fit = 'contain', quality = 90) {
        return new Promise(async (resolve, reject) => {
            const uploadPath = uploadDirectory.getResizedImageDirectoryWithImageTitle(category, image.filename)

            await sharp(image.path)
                .resize({
                    width: width,
                    fit: fit
                })
                .jpeg({ quality: quality })
                .toFile(uploadPath)
                .then(resized => {
                    resized.category = category;
                    resized.path = uploadPath;
                    resolve(resized);
                })
                .catch(error => reject(error));
        });
    }

    async resizeMultipleImages(images, category, width, fit, quality) {
        return new Promise(async (resolve, reject) => {
            if (images === undefined) return reject(new Error(`Error resizing images: no images to resize`));
            if (category === undefined) category = 'undefined';
            
            const resizedImages = images.map(image => this.resizeSingleImage(image, category, width, fit, quality));

            Promise.all(resizedImages)
                .then(resizedImages => resolve(resizedImages))
                .catch(error => reject(error))
        });
    }
}

module.exports = ImageResizer;