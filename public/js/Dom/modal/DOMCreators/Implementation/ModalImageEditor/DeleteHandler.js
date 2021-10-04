import ImageApi from "../../../../../api/ImageApi.js";

class DeleteHandler {
    constructor(alertHandler, modalImageEditor) {
        this.alertHandler = alertHandler;
        this.modalImageEditor = modalImageEditor;
    }

    async handleClickEvent(id) {

        if (confirm('Zeker dat je deze foto wil verwijderen?')) {
            try {
                const response = await ImageApi.deleteImage(id);
                this.modalImageEditor.close();
                this.modalImageEditor.removeImageContainerFromDOM(id);
                this.alertHandler.showSucces("Afbeelding verwijderd!");
            } catch (error) {
                console.error(error);
                this.alertHandler.showWarning("Fout bij het verwijderen van de afbeelding!");
            }
            
        }
    }
}

export default DeleteHandler;