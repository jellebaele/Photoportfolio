const fs = require('fs');

class FileRepository {
    constructor() {

    }

    static async moveImageToDir(image, newCategoryName) {
        const oldCategoryName = image.category;
        const originalSizeOldPath = image.img.path_original;
        const originalSizeNewPath = originalSizeOldPath.replace(`${oldCategoryName}`, `${newCategoryName}`);
        const smallSizeOldPath = image.img.path_resized;
        const smallSizeNewPath = smallSizeOldPath.replace(`${oldCategoryName}`, `${newCategoryName}`);

        try {
            const oSizeNewPath = await this.moveFile(originalSizeOldPath, originalSizeNewPath);
            const sSizeNewPath = await this.moveFile(smallSizeOldPath, smallSizeNewPath);
            return {
                originalSizeNewPath: oSizeNewPath,
                smallSizeNewPath: sSizeNewPath
            }
        } catch (error) {
            throw error;
        }
    }

    static async moveFile(originalPath, newPath) {
        await fs.promises.rename(originalPath, newPath, (err) => {
            if (err){
                throw err;
            }
            return;
        });
        return newPath;
    }
}

module.exports = FileRepository