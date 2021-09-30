class EditHandler {
    constructor() {
        this.isEditMode = false;
        this.originalInputValues = {};
    }

    handleClickEvent(id, inputFields, buttons) {
        if (this.isEditMode) {
            this.cancelEdit(inputFields, buttons);
        } else {
            this.startEdit(inputFields, buttons);
        }
    }

    startEdit(inputFields, buttons) {
        this.retrieveOriginalValuesFromDOM(inputFields, this.originalInputValues)
        this.setInputTagsDisabled(inputFields, false);
        
        // this.fillCategoriesDropdown(this.category.querySelector("select"));
        this.adjustButton(buttons.deleteButton, "fa fa-check", "Accepteren");
        this.adjustButton(buttons.editButton, "fa fa-times", "Annuleren");


        this.isEditMode = true;
        console.log("Start Edit");
    }

    cancelEdit(inputFields, buttons) {
        this.setInputTagsDisabled(inputFields, true);
        this.setOriginalValuesToDOM(inputFields, this.originalInputValues);

        this.adjustButton(buttons.deleteButton, "fa fa-trash", "Delete");
        this.adjustButton(buttons.editButton, "fa fa-pencil", "Bewerken");

        this.isEditMode = false;
        console.log("Stop edit");
    }

    retrieveOriginalValuesFromDOM(inputFields, originalTextAreaValues) {
        inputFields.forEach(iField => {
            originalTextAreaValues[iField.id] = iField.value;
        });
        return originalTextAreaValues;
    }

    setOriginalValuesToDOM(textAreas, originalTextAreaValues) {
        textAreas.forEach(textArea => {
            textArea.value = originalTextAreaValues[textArea.id];
        })
    }

    setInputTagsDisabled(tags, isEnabled) {
        tags.forEach(tag => tag.disabled = isEnabled);
    }

    adjustButton(button, icon, content) {
        button.innerHTML = `<i class=\"${icon}\"aria-hidden=\"true\"></i>${content}`;
    }
}

export default EditHandler;