import ModalDOMCreator from "../../Base/ModalDOMCreator.js";

class HeaderCreator extends ModalDOMCreator {
    constructor(className) {
        super(className);
    }

    create() {
        const title = document.createElement("div");
        title.classList.add("title-modal");
        title.innerHTML = "DETAILS";

        const closeButton = document.createElement("button");
        closeButton.classList.add("container-button");
        closeButton.classList.add("close-modal");
        closeButton.innerHTML = "<i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i>"
        // closeButton.addEventListener("click", () => this.close());

        this.mainTag.appendChild(title);
        this.mainTag.appendChild(closeButton);
        return {
            mainTag: this.mainTag,
            buttons: {
                closeButton: closeButton
            }
        };
    }
}

export default HeaderCreator;