const path = require('path');
require('dotenv').config();

const ROOT_FOLDER = path.join(`${__dirname}/../${process.env.UPLOAD_FOLDER_NAME}`)

function getRoot() {
    return ROOT_FOLDER;
}

function getRootCategory(categoryTitle) {
    return path.join(`${ROOT_FOLDER}/${categoryTitle}`);
}

function getOriginalImageDirectory(categoryTitle) {
    return path.join(`${ROOT_FOLDER}/${categoryTitle}/${process.env.ORIGINAL_SIZE_FOLDER_NAME}`);
}

function getResizedImageDirectory(categoryTitle) {
    return path.join(`${ROOT_FOLDER}/${categoryTitle}/${process.env.RESIZED_SIZE_FOLDER_NAME}`);
}

function getResizedImageDirectoryWithImageTitle(categoryTitle, imageTitle) {
    return path.join(`${ROOT_FOLDER}/${categoryTitle}/${process.env.RESIZED_SIZE_FOLDER_NAME}/${imageTitle}`);
}

module.exports = {
    getRoot,
    getRootCategory,
    getOriginalImageDirectory,
    getResizedImageDirectory,
    getResizedImageDirectoryWithImageTitle
}