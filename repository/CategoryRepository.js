const fs = require('fs');
const path = require("path");
const CategoryModel = require("../models/Category");

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
            await this.createDirectory(categoryTitle);
            return newCategorySaved;
        } catch (error) {
            throw error;
        }
    }

    createDirectory(categoryTitle) {
        fs.mkdir(path.join(`${__dirname}/../uploads/categories/${categoryTitle}`), (err) => {
            if (err) throw err;
        })
    }

    removeDirectory(categoryTitle) {
        fs.rmdir(path.join(`${__dirname}/../uploads/categories/${categoryTitle}`), { recursive: true }, (err) => {
            if (err) throw (err);
        })
    }

    async updateAmountOfPicturesByTitle(categoryTitle, amountOfPictures) {
        try {
            const category = await this.searchByTitle(categoryTitle, 1);

            if (category.length > 0) {
                const filter = { title: category[0].title };
                const updateCategory = {
                    $set: {
                        amountOfPictures: ++category[0].amountOfPictures,
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
            return await CategoryModel.updateOne(filter, updateCategory);
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const category = await this.searchById(id);

            if (category.length > 0) {
                const deletedCategory = await CategoryModel.deleteOne({ _id: id });
                await this.removeDirectory(category[0].title);;
                return deletedCategory;
            } else {
                throw new Error("Category does not exist");
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CategoryRepository;