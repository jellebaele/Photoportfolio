import ModalBase from "./ModalBase.js"

class ModalImageEditor extends ModalBase {
    createTagElements() {
        super.createOverlay();
        const container = this.createContainer();
        container.appendChild(this.createHeader());
        container.appendChild(this.createBody());
        
        this.overlay.appendChild(container);
        this.main.appendChild(this.overlay);
    }

    addListeners () {
    }

    createContainer() {
        const containerTag = document.createElement("div");
        containerTag.classList.add("modal-container");
  
        return containerTag;
    }

    createHeader() {
        const headerTag = document.createElement("div");
        headerTag.classList.add("header-modal");

        const title = document.createElement("div");
        title.classList.add("title-modal");
        title.innerHTML = "DETAILS";

        const closeButton = document.createElement("button");
        closeButton.classList.add("container-button");
        closeButton.classList.add("close-modal");
        closeButton.innerHTML = "<i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i>"

        headerTag.appendChild(title);
        headerTag.appendChild(closeButton);
        return headerTag;
    }

    createBody() {
        const bodyTag = document.createElement("div");
        bodyTag.classList.add("modal-body");

        bodyTag.appendChild(this.createRow("Titel", "title", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis, modi?"));
        return bodyTag;
    }

    createRow(rowName, rowId, rowContent, isDisabled = true) {
        const rowTag = document.createElement("div");
        rowTag.classList.add("modal-row");

        const label = document.createElement("label");
        label.classList.add("text-field");
        label.setAttribute("for", rowId);
        label.innerHTML = rowName;

        const textArea = document.createElement("textarea");
        textArea.id = rowId;
        // textArea.type = "text";
        if (isDisabled) textArea.disabled = true;
        textArea.innerHTML = rowContent;

        rowTag.appendChild(label);
        rowTag.appendChild(textArea);
        return rowTag;
    }

}

export default ModalImageEditor