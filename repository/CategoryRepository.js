const CategoryModel = require("../models/Category");

class CategoryControllerHelper {
    async createCategory(categoryTitle, amountOfPictures = 0) {
        if (categoryTitle === "") categoryTitle = "undefined";

        return new Promise((resolve, reject) => {
            this.searchCategory(categoryTitle)
                .then(result => {
                    if (result < 1) {
                        this.createNewCategory(categoryTitle, amountOfPictures)
                            .then(newCategory => resolve(newCategory))
                            .catch(error => reject(error));
                    } else {
                        reject("Category already exists");
                    }
                })
                .catch(error => console.log(error))
        });
    }

    async createOrUpdateCategory(categoryTitle, amountOfPictures = 0) {
        if (categoryTitle === "") categoryTitle = "undefined";

        return new Promise((resolve, reject) => {
            this.searchCategory(categoryTitle)
                .then(result => {
                    if (result < 1) {
                        this.createNewCategory(categoryTitle, amountOfPictures)
                            .then(newCategory => resolve(newCategory.title))
                            .catch(error => reject(error));
                    } else {
                        this.updateCategoryByTitle(categoryTitle, result[0].amountOfPictures)
                            .then(() => {
                                resolve(result[0].title)
                            })
                            .catch(error => reject(error));
                    }
                })
                .catch(error => reject(error));
        });
    }

    async searchCategory(title) {
        return new Promise((resolve, reject) => {
            CategoryModel.find({ title: title })
                .limit(1)
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        });
    }

    async searchCategories(title, limit) {
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
                .then((newCategory) => resolve(newCategory))
                .catch(error => reject(error));
        });
    }

    async updateCategoryByTitle(categoryTitle, amountOfPictures) {
        return new Promise((resolve, reject) => {
            const filter = { title: categoryTitle };
            const updateCategory = {
                $set: {
                    amountOfPictures: ++amountOfPictures,
                },
            };

            CategoryModel.updateOne(filter, updateCategory)
                .then(updatedCategory => {
                    resolve(updatedCategory)
                })
                .catch(error => reject(error));
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


        // await CategoryModel.updateOne({
        //     _id: req.query.id,
        //     $set: { title: req.query.newTitle }
        // })
        //     .then(updatedCategory => res.status(200).json({ updatedCategory: updatedCategory }))
        //     // TODO Change error code
        //     .catch(error => res.status(500).json({ message: error }))
    }

    async deleteCategory(id) {
        return new Promise((resolve, reject) => {
            CategoryModel.deleteOne({ _id: id })
                .then(deletedCategory => resolve(deletedCategory))
                .catch(error => reject(error));
        })
    }
}

module.exports = CategoryControllerHelper;