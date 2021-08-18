import FadeCreator from "../dom/images/FadeCreator.js";

const imageContainers = document.querySelectorAll(".img-container");

function init() {
    let fadeCreator = new FadeCreator(imageContainers);
    fadeCreator.addListeners();
}

init();