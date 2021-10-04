import ModalBase from "../../Base/ModalBase.js"
import BodyCreator from "./BodyCreator.js";
import EditHandler from "./EditHandler.js";
import HeaderCreator from "./HeaderCreator.js";

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
        this.headerCreator = new HeaderCreator("header-modal");
        this.bodyCreator = new BodyCreator("modal-body");
        this.editHandler = new EditHandler(this.bodyCreator, alertHandler);
    }

    createModal() {
        this.container = this.createContainer();
        this.overlay.appendChild(this.container);
    }

    addListeners() {
        this.elements.imageContainers.forEach(imageContainer => {
            const id = imageContainer.id;

            // const deleteButton = imageContainer.querySelector(".delete-button");
            // deleteButton.addEventListener('click', () => this.deleteImageHandler(id));

            const detailsButton = imageContainer.querySelector(".details-button");
            detailsButton.addEventListener('click', () => this.open(id));
        });
    }

    // Override
    close() {
        super.close();
        this.headerCreator.clear();
        this.bodyCreator.clear();
    }

    // Override
    async open(id) {
        const header = this.createHeader();
        const body = await this.createBody(id);

        this.container.appendChild(header);
        this.container.appendChild(body);
        super.open();
    }

    createContainer() {
        const containerTag = document.createElement("div");
        containerTag.classList.add("modal-container");

        return containerTag;
    }

    createHeader() {
        const header = this.headerCreator.create();
        header.buttons.closeButton.addEventListener("click", () => this.close());

        return header.mainTag;
    }

    async createBody(id) {
        const image = await this.fetchImageDetails(id);
        const body = this.bodyCreator.create(image, id);
        const inputFields = this.getInputFieldsToEdit(body.mainTag);

        body.buttons.editButton.addEventListener("click", () => this.editHandler.handleClickEvent(id, inputFields, body.buttons));
        body.buttons.deleteButton.addEventListener("click", () => this.deleteHandler());

        return body.mainTag;
    }

    getInputFieldsToEdit(body) {
        const titleTextArea = body.querySelector("#title");
        const categorySelectArea = body.querySelector("#category");
        const descriptionTextArea = body.querySelector("#description");

        return new Map([
            ["titleTextArea", titleTextArea], 
            ["categorySelectArea", categorySelectArea],
            ["descriptionTextArea", descriptionTextArea]
        ]);
    }

    deleteHandler() {
        console.log("Test Delete");
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