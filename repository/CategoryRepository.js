const CategoryModel = require("../models/Category");
const FileRepository = require('./FileRepository');

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
            await FileRepository.createDirectories(categoryTitle);
            return newCategorySaved;
        } catch (error) {
            throw error;
        }
    }

    async adjustAmountOfPicturesByTitle(categoryTitle, factor = 0) {
        try {
            const category = await this.searchByTitle(categoryTitle, 1);

            if (category.length > 0) {
                const newAmountOfPictures = await category[0].amountOfPictures + factor;
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

    async updateCategoryTitleById(id, newTitle) {
        const filter = { _id: id };
        const updateCategoryQuery = {
            $set: { title: newTitle }
        };

        try {
            const oldCategory = await this.searchById(id);
            if (oldCategory.length > 0) {
                const updatedCategoryStatus = await CategoryModel.updateOne(filter, updateCategoryQuery);
                await FileRepository.renameDirectory(oldCategory[0].title, newTitle);
                const updatedCategory = await this.searchById(id);
                return { status: updatedCategoryStatus, updateCategory: updatedCategory }
            } else {
                throw new Error("Category to be renamed does not exist");
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
                await FileRepository.removeDirectories(category[0].title);;
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