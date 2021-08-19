class FadeCreator {
    constructor(url, galleryImages, popupHandler) {
        this.url = url;
        this.elements = {
            gallery: galleryImages,
            imageContainers: galleryImages.querySelectorAll(".img-container")
        };
        this.popupHandler = popupHandler;
        
    }

    addListeners() {
        this.elements.imageContainers.forEach(imageContainer => {
            const id = imageContainer.id;
            const deleteButton = imageContainer.querySelector(".container-button");

            deleteButton.addEventListener('click', () => this.deleteImageHandler(id));
        });
    }

    async deleteImageHandler(id) {
        await fetch(`${this.url}?id=${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.status !== 200) {
                    console.log(response.statusText);
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((response) => {
                const imageContainerToBeRemoved = document.getElementById(id);
                this.elements.gallery.removeChild(imageContainerToBeRemoved);
                this.popupHandler.showSucces("Afbeelding verwijderd!");
            })
            .catch((error) => {
                console.error(error);
                this.popupHandler.showWarning(`Fout bij het verwijderen van de afbeelding!`);
            })
    }

    removeElementFromDOM() {

    }
}

export default FadeCreator;