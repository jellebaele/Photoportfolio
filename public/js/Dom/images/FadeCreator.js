class FadeCreator {
    constructor(url, galleryImages, alertHandler) {
        this.url = url;
        this.elements = {
            gallery: galleryImages,
            imageContainers: galleryImages.querySelectorAll(".img-container")
        };
        this.alertHandler = alertHandler;
        
    }

    addListeners() {
        this.elements.imageContainers.forEach(imageContainer => {
            const id = imageContainer.id;
            
            const deleteButton = imageContainer.querySelector(".delete-button");
            deleteButton.addEventListener('click', () => this.deleteImageHandler(id));

            const detailsButton = imageContainer.querySelector(".details-button");
            detailsButton.addEventListener('click', () => this.detailsImageHandler(id));
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
                this.removeImageContainerFromDOM(id);
            })
            .catch((error) => {
                console.error(error);
                this.alertHandler.showWarning(`Fout bij het verwijderen van de afbeelding!`);
            })
    }

    removeImageContainerFromDOM(id) {
        const imageContainerToBeRemoved = document.getElementById(id);
        this.elements.gallery.removeChild(imageContainerToBeRemoved);
        this.alertHandler.showSucces("Afbeelding verwijderd!");
    }

    detailsImageHandler(id) {
        console.log(id);
    }
}

export default FadeCreator;