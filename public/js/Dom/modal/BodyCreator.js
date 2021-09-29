class BodyCreator {
    constructor() {
        this.bodyTag = document.createElement("div");
        this.bodyTag.classList.add("modal-body");

        this.isEditMode = false;
        this.originalTextAreaValues = {};
    }

    create(image, id) {
        this.title = this.createTextAreaRow("Titel", "title", image.title);
        this.category = this.createDropdownRow("Category", "category", image.category);
        this.description = this.createTextAreaRow("Beschrijving", "description", image.description);
        const originalInfoRow = this.createDetailedTextAreaDetailed("Origineel",
            this.getSubrowSizeInfo("size-original", "url-original", `${image.img.size_original}kB`, image.img.path_original))
        const resizedInfoRow = this.createDetailedTextAreaDetailed("Origineel",
            this.getSubrowSizeInfo("size-resized", "url-resize", `${image.img.size_resized}kB`, image.img.path_resized));
        const typeRow = this.createTextAreaRow("Type", "mime-type", image.img.mimetype);
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

    createTextAreaRow(rowName, rowId, rowContent, textFieldClassName = "text-field", isDisabled = true) {
        const rowTag = this.createRowTag();
        const label = this.createLabelTag(textFieldClassName, rowId, rowName);

        const textArea = document.createElement("textarea");
        textArea.id = rowId;
        this.setupTextArea(textArea, isDisabled, rowContent);

        rowTag.appendChild(label);
        rowTag.appendChild(textArea);
        return rowTag;
    }

    createDropdownRow(rowName, rowId, rowContent, textFieldClassName = "text-field", isDisabled = true) {
        const rowTag = this.createRowTag();
        const label = this.createLabelTag(textFieldClassName, rowId, rowName);

        const dropdown = document.createElement("select");
        dropdown.name = rowId;
        dropdown.disabled = isDisabled;
        
        const optionElement = document.createElement("option");
        optionElement.textContent = rowContent;
        optionElement.value = rowContent;
        
        dropdown.appendChild(optionElement);
        rowTag.appendChild(label);
        rowTag.appendChild(dropdown);
        return rowTag;
    }

    createLabelTag(textFieldClassName, rowId, rowName) {
        const label = document.createElement("label");
        label.classList.add(textFieldClassName);
        label.setAttribute("for", rowId);
        label.innerHTML = rowName;
        return label;
    }

    createRowTag() {
        const rowTag = document.createElement("div");
        rowTag.classList.add("modal-row");
        return rowTag;
    }

    setupTextArea(textArea, isDisabled, rowContent) {
        if (isDisabled)
            textArea.disabled = true;
        textArea.innerHTML = rowContent;

        this.resizeTextArea(textArea);
        textArea.addEventListener('keyup', (e) => {
            this.resizeTextArea(e.srcElement)
        });
        textArea.addEventListener('change', (e) => {
            this.resizeTextArea(e.srcElement)
        });
    }

    resizeTextArea(textArea) {
        let content = textArea.value;
        let columns = textArea.cols;

        let linecount = 0;
        content.split("\n").forEach(line => {
            linecount += Math.ceil(line.length / (columns * 2));
        });

        textArea.rows = linecount;
    }

    createDetailedTextAreaDetailed(mainRowName, subrows, isDisabled = true) {
        const mainRowTag = document.createElement("div");
        mainRowTag.classList.add("modal-row-detailed");

        const mainRowTitleTag = document.createElement("div");
        mainRowTitleTag.classList.add("text-field");
        mainRowTitleTag.innerHTML = mainRowName;
        mainRowTag.appendChild(mainRowTitleTag);

        subrows.forEach(subrow => {
            const row = this.createTextAreaRow(subrow.name, subrow.id, subrow.content, "text-field-detailed", isDisabled);
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
            this.acceptButton.addEventListener("click", () => this.saveChangesHandler(id, textAreas));
            modalRowButton.appendChild(this.acceptButton);

            this.isEditMode = true;
        }
    }

    saveChangesHandler(id, textAreas) {
        let inputValues = this.retrieveInputValuesFromDOM(textAreas);
  
        fetch(`/api/image?id=${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputValues)
        })
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

    retrieveInputValuesFromDOM(textAreas) {
        let values = {}
        textAreas.forEach(textArea => {
            values[textArea.id] = textArea.value;
        });

        return values;
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

    EditeableFormData(fTitle, fCategory, fDescription) {
        this.title = fTitle;
        this.category = fCategory;
        this.description = fDescription;
    }
}

export default BodyCreator;