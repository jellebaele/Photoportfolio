import ModalFullImage from "./Dom/modal/DOMCreators/Implementation/ModalFullImage/ModalFullImage.js";


const modal = document.querySelector('.modal');
const previews = document.querySelectorAll(".gallery img");

function init() {
  const fullImageModal = new ModalFullImage(modal, 0, 0, 0.3, previews);
  fullImageModal.create();
}

init();