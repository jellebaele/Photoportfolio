const fs = require('fs');
const path = require("path");
const CategoryModel = require("../models/Category");

class CategoryRepository {
    async createCategory(categoryTitle, amountOfPictures = 0) {
        if (categoryTitle === "") categoryTitle = "undefined";

        return new Promise((resolve, reject) => {
            this.searchCategoryByTitle(categoryTitle)
                .then(result => {
                    if (result < 1) {
                        this.createNewCategory(categoryTitle, amountOfPictures)
                            .then(newCategory => resolve({
                                created: true,
                                newCategory: newCategory,
                                existingCategory: undefined,
                            }))
                            .catch(error => reject(error));
                    } else {
                        resolve({
                            created: false,
                            newCategory: undefined,
                            existingCategory: result[0]
                        });
                    }
                })
                .catch(error => reject(error))
        });
    }

    async searchCategoryByTitle(title) {
        return new Promise((resolve, reject) => {
            CategoryModel.find({ title: title })
                .limit(1)
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        });
    }

    async searchCategoryById(id) {
        return new Promise((resolve, reject) => {
            CategoryModel.find({ _id: id })
                .limit(1)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => reject(error))
        });
    }

    async searchCategories(title, limit = 50) {
        if (limit > 50) limit = 50;

        return new Promise((resolve, reject) => {
            CategoryModel.find({ title: title })
                .limit(limit)
                .then((categories) => {
                    resolve(categories)
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }

    async createNewCategory(categoryTitle, amountOfPictures) {
        return new Promise((resolve, reject) => {
            const newCategory = new CategoryModel({
                title: categoryTitle,
                amountOfPictures: amountOfPictures,
            });
            newCategory.save()
                .then((newCategory) => {
                    this.createDirectory(categoryTitle)
                        .then(() => resolve(newCategory))
                        .catch(error => reject(error));
                })
                .catch(error => reject(error));
        });
    }

    createDirectory(categoryTitle) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path.join(`${__dirname}/../uploads/categories/${categoryTitle}`), (err) => {
                if (err) reject(err);
                resolve('Directory created')
            })
        })
    }

    removeDirectory(categoryTitle) {
        return new Promise((resolve, reject) => {
            fs.rmdir(path.join(`${__dirname}/../uploads/categories/${categoryTitle}`), { recursive: true }, (err) => {
                if (err) reject(err);
                else resolve('Directory deleted');
            })
        })

    }

    async updateCategoryAmountOfPicturesByTitle(categoryTitle, amountOfPictures) {
        return new Promise((resolve, reject) => {
            this.searchCategoryByTitle(categoryTitle)
                .then(result => {
                    if (result.length > 0) {
                        const filter = { title: result[0].title };
                        const updateCategory = {
                            $set: {
                                amountOfPictures: ++result[0].amountOfPictures,
                            },
                        };

                        CategoryModel.updateOne(filter, updateCategory)
                            .then(updatedCategory => {
                                resolve({
                                    status: updatedCategory,
                                    updatedCategory: result[0]
                                })
                            })
                            .catch(error => reject(error));
                    }
                })
                .catch(error => reject(error))
        })
    }

    async updateCategoryById(id, newTitle) {
        return new Promise((resolve, reject) => {
            const filter = { _id: id };
            const updateCategory = {
                $set: { title: newTitle }
            };

            CategoryModel.updateOne(filter, updateCategory)
                .then(updatedCategory => {
                    resolve(updatedCategory)
                })
                .catch(error => reject(error))
        })
    }

    async deleteCategory(id) {
        let category = await this.searchCategoryById(id);
        return new Promise((resolve, reject) => {
            if (category.length > 0) {
                CategoryModel.deleteOne({ _id: id })
                    .then(deletedCategory => {
                        this.removeDirectory(category[0].title);
                        resolve(deletedCategory)
                    })
                    .catch(error => reject(error));
            } else {
                reject(new Error("Category does not exist"));
            }
        })
    }
}

module.exports = CategoryRepository;