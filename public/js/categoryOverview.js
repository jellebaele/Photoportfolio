import ModalFullImage from "./Dom/modal/ModalFullImage.js";


const modal = document.querySelector('.modal');
const previews = document.querySelectorAll(".gallery img");
const fullImage = document.querySelector(".full-image");

function init() {
  const fullImageModal = new ModalFullImage(modal, 0, 0, 0.3, previews);
  fullImageModal.create();
}

init();