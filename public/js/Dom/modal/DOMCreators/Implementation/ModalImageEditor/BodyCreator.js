import ModalDOMCreator from "../../Base/ModalDOMCreator.js";

class BodyCreator extends ModalDOMCreator {
    constructor(className) {
        super(className);

        this.isEditMode = false;
        this.originalInputValues = {};
        this.buttonRow;
    }

    create(image, id) {
        this.title = this.createTextAreaRow("Titel", "title", image.title);
        this.category = this.createDropdownRow("Category", "category", image.category);
        this.description = this.createTextAreaRow("Beschrijving", "description", image.description);
        const originalInfoRow = this.createDetailedTextAreaRow("Origineel",
            this.getSubrowSizeInfo("size-original", "url-original", `${image.img.size_original}kB`, image.img.path_original))
        const resizedInfoRow = this.createDetailedTextAreaRow("Origineel",
            this.getSubrowSizeInfo("size-resized", "url-resize", `${image.img.size_resized}kB`, image.img.path_resized));
        const typeRow = this.createTextAreaRow("Type", "mime-type", image.img.mimetype);
        this.buttonRow = this.createButtonRow(id);

        this.mainTag.appendChild(this.title);
        this.mainTag.appendChild(this.category);
        this.mainTag.appendChild(this.description);
        this.mainTag.appendChild(originalInfoRow);
        this.mainTag.appendChild(resizedInfoRow);
        this.mainTag.appendChild(typeRow);
        this.mainTag.appendChild(this.buttonRow.buttonRow);
        return {
            mainTag: this.mainTag,
            buttons: {
                deleteButton: this.buttonRow.buttons.deleteButton,
                editButton: this.buttonRow.buttons.editButton
            }
        };
    }

    addButtonToButtonRow(button) {
        this.buttonRow.buttonRow.appendChild(button)
    }

    deleteButtonFromBody(button) {
        this.buttonRow.buttonRow.removeChild(button)
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
        rowTag.id = rowContent;
        const label = this.createLabelTag(textFieldClassName, rowId, rowName);

        const dropdown = document.createElement("select");
        dropdown.name = rowId;
        dropdown.id = rowId;
        dropdown.disabled = isDisabled;

        const optionElement = this.createDropdownElement(rowContent);

        dropdown.appendChild(optionElement);
        rowTag.appendChild(label);
        rowTag.appendChild(dropdown);
        return rowTag;
    }

    createDetailedTextAreaRow(mainRowName, subrows, isDisabled = true) {
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
        const editButton = this.createButton("button", "fa fa-pencil", "Bewerken");

        modalRowButton.appendChild(deleteButton);
        modalRowButton.appendChild(editButton);
        return {
            buttonRow: modalRowButton,
            buttons: {
                deleteButton: deleteButton,
                editButton: editButton
            }
        };
    }

    getSubrowSizeInfo(idSize, idUrl, size, url) {
        return [{ name: "Grootte", id: idSize, content: size }, { name: "Url", id: idUrl, content: url }];
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

    createDropdownElement(rowContent) {
        const optionElement = document.createElement("option");
        optionElement.textContent = rowContent;
        optionElement.value = rowContent;
        return optionElement;
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

    createButton(className, icon, content) {
        const button = document.createElement("button");
        button.classList.add(className);
        button.innerHTML = `<i class=\"${icon}\"aria-hidden=\"true\"></i>${content}`;
        return button;
    }

    hideButton(button) {
        button.classList.add("hide");
    }

    showButton(button) {
        button.classList.remove("hide");
    }

    adjustButton(button, icon, content) {
        button.innerHTML = `<i class=\"${icon}\"aria-hidden=\"true\"></i>${content}`;
    }

    setInputTagsDisabled(tags, isEnabled) {
        tags.forEach(tag => tag.disabled = isEnabled);
    }
}

export default BodyCreator;