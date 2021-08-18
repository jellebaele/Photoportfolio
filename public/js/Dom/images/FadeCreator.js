class FadeCreator {
    constructor(url ,imageContainers) {
        this.url = url;
        this.imageContainers = imageContainers;
    }

    addListeners() {
        this.imageContainers.forEach(imageContainer => {
            const id = imageContainer.id;
            const deleteButton = imageContainer.querySelector(".container-button");
            
            deleteButton.addEventListener('click', () => this.deleteImageHandler(id));
        });
    }

    async deleteImageHandler(id) {
        // await fetch(``, {
        //     method: "DELETE",
        //  })
        //     .then((response) => {
        //        if (response.status !== 200) {
        //           throw new Error(response.statusText);
        //        }
        //        return response.json();
        //     })
        //     .then((response) => {
        //        this.populateResults(response);
        //     })
        //     .catch((error) => {
        //        console.error(error);
        //        this.populateResults([]);
        //        this.popupHandler.showWarning(error.message);
        //     })
    }
}

export default FadeCreator;