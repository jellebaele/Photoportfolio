const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require("path");
const UploadDirectory = require("../configuration/uploadDirectory");

class FileRepository {
    static async createDirectories(categoryTitle) {
        await fs.promises.mkdir(path.join(UploadDirectory.getRootCategory(categoryTitle)), (err) => {
            if (err) throw err;
            return;
        });

        await fs.promises.mkdir(path.join(UploadDirectory.getOriginalImageDirectory(categoryTitle)), (err) => {
            if (err) throw err;
            return;
        });

        await fs.promises.mkdir(path.join(UploadDirectory.getResizedImageDirectory(categoryTitle)), (err) => {
            if (err) throw err;
            return;
        });
    }

    static async renameDirectory(oldTitle, newTitle) {
        const srcPath = UploadDirectory.getRootCategory(oldTitle);
        const destPath = UploadDirectory.getRootCategory(newTitle);

        fsExtra.copy(srcPath, destPath, (err) => {
            if (err) throw err;
            this.removeDirectories(oldTitle);
        });
    }

    static removeDirectories(categoryTitle) {
        fs.promises.rmdir(path.join(UploadDirectory.getRootCategory(categoryTitle)), { recursive: true }, (err) => {
            if (err) throw (err);
        })
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

    static async deleteImageInDirectory(pathOriginal, pathResized) {
        await fs.promises.unlink(pathOriginal, (err) => {
           if (err) throw err;
           return;
        });
  
        await fs.promises.unlink(pathResized, (err) => {
           if (err) throw err;
           return;
        });
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