import ModalBase from "./ModalBase.js"
import BodyCreator from "./BodyCreator.js";

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

export default ModalImageEditor;