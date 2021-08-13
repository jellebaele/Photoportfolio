import ModalCreator from "./modal/ModalCreator.js";

const modal = document.querySelector('.modal');
const previews = document.querySelectorAll(".gallery img");
const fullImage = document.querySelector(".full-image");


function init() {
  const modalCreator = new ModalCreator(modal, previews, fullImage);
  modalCreator.addEventListeners();
}

init();