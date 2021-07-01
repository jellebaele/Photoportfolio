const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require("path");
const CategoryModel = require("../models/Category");
const UploadDirectory = require("../general/UploadDirectory");

class CategoryRepository {
    async create(categoryTitle, amountOfPictures = 0) {
        if (categoryTitle === "") categoryTitle = "undefined";
        try {
            const category = await this.searchByTitle(categoryTitle, 1);
            if (category < 1) {
                const newCategory = await this.createNewCategory(categoryTitle, amountOfPictures);

                return {
                    created: true,
                    newCategory: newCategory,
                    existingCategory: undefined
                }
            } else {
                return {
                    created: false,
                    newCategory: undefined,
                    existingCategory: category[0]
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async searchById(id) {
        try {
            return await CategoryModel.find({ _id: id }).limit(1);
        } catch (error) {
            throw error;
        }
    }

    async searchByTitle(title, limit = 50) {
        if (limit > 50) limit = 50;

        try {
            return await CategoryModel.find({ title: title }).limit(limit);
        } catch (error) {
            throw error;
        }
    }

    async createNewCategory(categoryTitle, amountOfPictures) {
        try {
            const newCategory = new CategoryModel({
                title: categoryTitle,
                amountOfPictures: amountOfPictures,
            });

            const newCategorySaved = await newCategory.save();
            await this.createDirectories(categoryTitle);
            return newCategorySaved;
        } catch (error) {
            throw error;
        }
    }

    async incrementAmountOfPicturesByTitle(categoryTitle, sum = 1) {
        try {
            const category = await this.searchByTitle(categoryTitle, 1);

            if (category.length > 0) {
                const newAmountOfPictures = await category[0].amountOfPictures + sum;
                const filter = { title: category[0].title };
                const updateCategory = {
                    $set: {
                        amountOfPictures: newAmountOfPictures,
                    },
                };

                const updatedCategory = await CategoryModel.updateOne(filter, updateCategory);
                return {
                    status: updatedCategory,
                    updatedCategory: category[0]
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async updateTitleById(id, newTitle) {
        const filter = { _id: id };
        const updateCategory = {
            $set: { title: newTitle }
        };

        try {
            const oldCategory = await this.searchById(id);
            if (oldCategory.length > 0) {
                await CategoryModel.updateOne(filter, updateCategory);
                this.renameDirectory(oldCategory[0].title, newTitle);
            }            
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const category = await this.searchById(id);

            if (category.length > 0) {
                const deletedCategory = await CategoryModel.deleteOne({ _id: id });
                await this.removeDirectories(category[0].title);;
                return deletedCategory;
            } else {
                throw new Error("Category does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    async createDirectories(categoryTitle) {
        await fs.mkdir(path.join(UploadDirectory.getRootCategory(categoryTitle)), (err) => {
            if (err) throw err;
            return;
        });

        await fs.mkdir(path.join(UploadDirectory.getOriginalImageDirectory(categoryTitle)), (err) => {
            if (err) throw err;
            return;
        });

        await fs.mkdir(path.join(UploadDirectory.getResizedImageDirectory(categoryTitle)), (err) => {
            if (err) throw err;
            return;
        });
    }

    async renameDirectory(oldTitle, newTitle) {
        const srcPath = UploadDirectory.getRootCategory(oldTitle);
        const destPath = UploadDirectory.getRootCategory(newTitle);

        await fsExtra.copy(srcPath, destPath, (err) => {
            if (err) throw err;
            this.removeDirectories(oldTitle);
        });
    }

    removeDirectories(categoryTitle) {
        fs.rmdir(path.join(`${__dirname}/../uploads/categories/${categoryTitle}`), { recursive: true }, (err) => {
            if (err) throw (err);
        })
    }
}

module.exports = CategoryRepository;