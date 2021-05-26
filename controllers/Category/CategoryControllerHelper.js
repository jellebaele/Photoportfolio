const CategoryModel = require("../../models/Category");

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
                            .then(newCategory => resolve(newCategory))
                            .catch(error => reject(error));
                    } else {
                        this.updateCategory(categoryTitle, result[0].amountOfPictures)
                            .then(updatedCategory => resolve(updatedCategory))
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

    async createNewCategory(categoryTitle, amountOfPictures) {
        return new Promise((resolve) => {
            const newCategory = new CategoryModel({
                title: categoryTitle,
                amountOfPictures: amountOfPictures,
            });
            newCategory.save()
                .then((newCategory) => resolve(newCategory))
                .catch(error => reject(error));
        });
    }

    async updateCategory(categoryTitle, amountOfPictures) {
        const filter = { title: categoryTitle };
        const updateCategory = {
            $set: {
                amountOfPictures: ++amountOfPictures,
            },
        };
        return await CategoryModel.updateOne(filter, updateCategory);
    }
}

module.exports = CategoryControllerHelper;