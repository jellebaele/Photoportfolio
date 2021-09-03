import ModalBase from "./ModalBase.js"

class ModalImageEditor extends ModalBase {
    constructor(main, height, width, overlayOpacity = 0.3, galleryImages, url, alertHandler) {
        super(main, height, width, overlayOpacity);
        this.elements = {
            gallery: galleryImages,
            imageContainers: galleryImages.querySelectorAll(".img-container")
        };
        this.url = url;
        this.alertHandler = alertHandler;

        this.container;
        this.bodyCreator = new BodyCreator();
    }

    createModal() {
        this.container = this.createContainer();
        this.container.appendChild(this.createHeader());
        this.overlay.appendChild(this.container);
    }

    addListeners() {
        this.elements.imageContainers.forEach(imageContainer => {
            const id = imageContainer.id;

            // const deleteButton = imageContainer.querySelector(".delete-button");
            // deleteButton.addEventListener('click', () => this.deleteImageHandler(id));

            const detailsButton = imageContainer.querySelector(".details-button");
            detailsButton.addEventListener('click', () => this.detailsButtonImageHandler(id));
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close();
            }
        });
    }

    close() {
        super.close();
        this.bodyCreator.clear();
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
        closeButton.addEventListener("click", () => this.close());

        headerTag.appendChild(title);
        headerTag.appendChild(closeButton);
        return headerTag;
    }

    async detailsButtonImageHandler(id) {
        const image = await this.fetchImageDetails(id);
        const infoBody = this.bodyCreator.create(image, id);
        this.container.appendChild(infoBody);
        super.open();
    }

    async fetchImageDetails(id) {
        try {
            const response = await fetch(`${this.url}?id=${id}`, {
                method: "GET"
            });

            if (response.status !== 200) throw new Error(response.statusText)
            return await response.json();
        } catch (error) {
            this.alertHandler.showWarning(error);
        }
    }
}

class BodyCreator {
    constructor() {
        this.bodyTag = document.createElement("div");
        this.bodyTag.classList.add("modal-body");

        this.isEditMode = false;
        this.originalTextAreaValues = {};
    }

    create(image, id) {
        this.title = this.createRow("Titel", "title", image.title);
        this.category = this.createRow("Category", "category", image.category);
        this.description = this.createRow("Beschrijving", "description", image.description);
        const originalInfoRow = this.createRowDetailed("Origineel",
            this.getSubrowSizeInfo("size-original", "url-original", `${image.img.size_original}kB`, image.img.path_original))
        const resizedInfoRow = this.createRowDetailed("Origineel",
            this.getSubrowSizeInfo("size-resized", "url-resize", `${image.img.size_resized}kB`, image.img.path_resized));
        const typeRow = this.createRow("Type", "mime-type", image.img.mimetype);
        const buttonRow = this.createButtonRow(id);

        this.bodyTag.appendChild(this.title);
        this.bodyTag.appendChild(this.category);
        this.bodyTag.appendChild(this.description);
        this.bodyTag.appendChild(originalInfoRow);
        this.bodyTag.appendChild(resizedInfoRow);
        this.bodyTag.appendChild(typeRow);
        this.bodyTag.appendChild(buttonRow);
        return this.bodyTag;
    }

    clear() {
        this.bodyTag.innerHTML = "";
    }

    getSubrowSizeInfo(idSize, idUrl, size, url) {
        return [{ name: "Grootte", id: idSize, content: size }, { name: "Url", id: idUrl, content: url }];
    }

    createRow(rowName, rowId, rowContent, textFieldClassName = "text-field", isDisabled = true) {
        const rowTag = document.createElement("div");
        rowTag.classList.add("modal-row");

        const label = document.createElement("label");
        label.classList.add(textFieldClassName);
        label.setAttribute("for", rowId);
        label.innerHTML = rowName;

        const textArea = document.createElement("textarea");
        textArea.id = rowId;
        if (isDisabled) textArea.disabled = true;
        textArea.innerHTML = rowContent;

        rowTag.appendChild(label);
        rowTag.appendChild(textArea);
        return rowTag;
    }

    createRowDetailed(mainRowName, subrows, isDisabled = true) {
        const mainRowTag = document.createElement("div");
        mainRowTag.classList.add("modal-row-detailed");

        const mainRowTitleTag = document.createElement("div");
        mainRowTitleTag.classList.add("text-field");
        mainRowTitleTag.innerHTML = mainRowName;
        mainRowTag.appendChild(mainRowTitleTag);

        subrows.forEach(subrow => {
            const row = this.createRow(subrow.name, subrow.id, subrow.content, "text-field-detailed", isDisabled);
            mainRowTag.appendChild(row);
        });

        return mainRowTag;
    }

    createButtonRow(id) {
        const modalRowButton = document.createElement("div");
        modalRowButton.classList.add("modal-row-buttons");

        const deleteButton = this.createButton("button", "fa fa-trash", "Verwijderen");
        deleteButton.addEventListener('click', () => this.deleteHandler(id));

        const editButton = this.createButton("button", "fa fa-pencil", "Bewerken");
        editButton.addEventListener('click', () => this.editHandler(id, editButton, modalRowButton, this.getTextAreasToEdit()));

        modalRowButton.appendChild(deleteButton);
        modalRowButton.appendChild(editButton);
        return modalRowButton;
    }

    createButton(className, icon, content) {
        const button = document.createElement("button");
        button.classList.add(className);
        button.innerHTML = `<i class=\"${icon}\"aria-hidden=\"true\"></i>${content}`;
        return button;
    }

    adjustButton(button, icon, content) {
        button.innerHTML = `<i class=\"${icon}\"aria-hidden=\"true\"></i>${content}`;
    }

    deleteButton(parentNode, button) {
        parentNode.removeChild(button);
    }

    deleteHandler(id) {
        console.log("Delete " + id);
    }

    getTextAreasToEdit() {
        const titleTextArea = this.title.querySelector("textarea");
        const categoryTextArea = this.category.querySelector("textarea");
        const descriptionTextArea = this.description.querySelector("textarea");

        return [titleTextArea, categoryTextArea, descriptionTextArea];
    }

    editHandler(id, editButton, modalRowButton, textAreas) {
        if (this.isEditMode) {
            this.cancelEdit(textAreas, editButton, modalRowButton);
        } else {
            this.retrieveOriginalValuesFromDOM(textAreas, this.originalTextAreaValues);
            this.setDisableInputTags(textAreas, false);

            this.adjustButton(editButton, "fa fa-times", "Annuleren");
            this.acceptButton = this.createButton("button", "fa fa-check", "Opslaan");
            modalRowButton.appendChild(this.acceptButton);

            this.isEditMode = true;
        }
    }

    retrieveOriginalValuesFromDOM(textAreas, originalTextAreaValues) {
        textAreas.forEach(textArea => {
            originalTextAreaValues[textArea.id] = textArea.value;
        });

        return originalTextAreaValues;
    }

    setOriginalValuesToDOM(textAreas, originalTextAreaValues) {
        textAreas.forEach(textArea => {
            textArea.value = originalTextAreaValues[textArea.id];
        })
    }

    setDisableInputTags(tags, isEnabled) {
        tags.forEach(tag => tag.disabled = isEnabled);
    }

    cancelEdit(textAreas, editButton, modalRowButton) {
        this.setDisableInputTags(textAreas, true);
        this.setOriginalValuesToDOM(textAreas, this.originalTextAreaValues);
        this.adjustButton(editButton, "fa fa-pencil", "Bewerken");
        this.deleteButton(modalRowButton, this.acceptButton)
        this.isEditMode = false;
    }
}

export default ModalImageEditor