const path = require('path');

const ORIGINAL_SIZE_FOLDER_NAME = "original"
const RESIZED_SIZE_FOLDER_NAME = "resized"
const root = path.join(`${__dirname}/../uploads`)

function getRoot() {
    return root;
}

function getRootCategory(categoryTitle) {
    return  path.join(`${root}/${categoryTitle}`);
}

function getOriginalImageDirectory(categoryTitle) {
    return path.join(`${root}/${categoryTitle}/${ORIGINAL_SIZE_FOLDER_NAME}`);
}

function getResizedImageDirectory(categoryTitle) {
    return path.join(`${root}/${categoryTitle}/${RESIZED_SIZE_FOLDER_NAME}`);
}

function getResizedImageDirectoryWithImageTitle(categoryTitle, imageTitle) {
    return path.join(`${root}/${categoryTitle}/${RESIZED_SIZE_FOLDER_NAME}/${imageTitle}`);
}

module.exports = {
    getRoot,
    getRootCategory,
    getOriginalImageDirectory,
    getResizedImageDirectory,
    getResizedImageDirectoryWithImageTitle
}