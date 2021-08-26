import ModalBase from "./ModalBase.js"

class ModalImageEditor extends ModalBase {
    createTagElements() {
        super.createOverlay();
        this.overlay.appendChild(this.createContainer());

        this.main.appendChild(this.overlay);
    }

    addListeners () {
    }

    createContainer() {
        const containerTag = document.createElement("div");
        containerTag.classList.add("modal-container");
  
        return containerTag;
    }

}

export default ModalImageEditor