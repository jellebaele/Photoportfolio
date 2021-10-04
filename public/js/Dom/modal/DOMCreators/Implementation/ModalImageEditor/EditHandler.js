import CategoryApi from "../../../../../api/CategoryApi.js";
import ImageApi from "../../../../../api/ImageApi.js";

const LIMIT = 5000;

class EditHandler {
    constructor(bodyCreator, alertHandler, modalImageEditor) {
        this.bodyCreator = bodyCreator;
        this.alertHandler = alertHandler;
        this.modalImageEditor = modalImageEditor;

        this.isEditMode = false;
        this.originalInputValues = {};
        this.acceptButton;
    }

    handleClickEvent(id, inputFields, buttons) {
        if (this.isEditMode) {
            this.cancelEdit(inputFields, buttons);
        } else {
            this.startEdit(id, inputFields, buttons);
        }
    }

    startEdit(id, inputFields, buttons) {
        this.retrieveOriginalValuesFromDOM(inputFields, this.originalInputValues)
        this.bodyCreator.setInputTagsDisabled(inputFields, false);
        this.fillCategoriesDropdown(inputFields.get("categorySelectArea"));

        this.bodyCreator.hideButton(buttons.deleteButton);
        this.bodyCreator.adjustButton(buttons.editButton, "fa fa-times", "Annuleren");
        this.createAcceptButton(id, inputFields, buttons);

        this.isEditMode = true;
    }

    cancelEdit(inputFields, buttons) {
        this.bodyCreator.setInputTagsDisabled(inputFields, true);
        this.setOriginalValuesToDOM(inputFields, this.originalInputValues);

        this.bodyCreator.showButton(buttons.deleteButton);
        this.bodyCreator.adjustButton(buttons.editButton, "fa fa-pencil", "Bewerken");
        this.bodyCreator.deleteButtonFromBody(this.acceptButton);

        this.isEditMode = false;
    }

    retrieveOriginalValuesFromDOM(inputFields, originalTextAreaValues) {
        inputFields.forEach(iField => {
            originalTextAreaValues[iField.id] = iField.value;
        });
        return originalTextAreaValues;
    }

    retrieveCurrentValuesFromDOM(inputFields) {
        let values = {}
        inputFields.forEach(iField => {
            values[iField.id] = iField.value;
        });

        return values;
    }

    setOriginalValuesToDOM(inputFields, originalInputValues) {
        inputFields.forEach(iField => {
            iField.value = originalInputValues[iField.id];
        })
    }

    createAcceptButton(id, inputFields, buttons) {
        this.acceptButton = this.bodyCreator.createButton("button", "fa fa-check", "Opslaan");
        this.acceptButton.addEventListener("click", () => this.saveChangesHandler(id, inputFields, buttons));
        this.bodyCreator.addButtonToButtonRow(this.acceptButton);
    }

    async fillCategoriesDropdown(dropdownTag) {
        try {
            const categories = await CategoryApi.searchAllCategories(LIMIT);

            categories.forEach(category => {
                if (category.title !== dropdownTag.value) {
                    const dropdownElement = this.bodyCreator.createDropdownElement(category.title);
                    dropdownTag.appendChild(dropdownElement);
                }
            });
        } catch (error) {
            this.alertHandler.showWarning(error.message);
        }
    }

    async saveChangesHandler(id, inputFields, buttons) {
        try {
            const inputValues = this.retrieveCurrentValuesFromDOM(inputFields);
            const response = await ImageApi.patchImage(id, inputValues);

            if (response.updatedImage.image.category !== this.originalInputValues.category) {
                this.modalImageEditor.close();
                this.modalImageEditor.removeImageContainerFromDOM(id);
                this.alertHandler.showSucces(`Afbeelding succesvol verplaatst naar categorie '${response.updatedImage.image.category}'`);
            } else {
                this.retrieveOriginalValuesFromDOM(inputFields, this.originalInputValues); 
                this.alertHandler.showSucces("Succesvol geüpdatet!");
            }
        } catch (error) {
            this.alertHandler.showWarning(error.message);
        } finally {
            this.cancelEdit(inputFields, buttons);
        }
    }
}

export default EditHandler;