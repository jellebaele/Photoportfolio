import OverlayCreator from "./DOMCreators/Implementation/OverlayCreator.js";

class ModalBase {

    RGBBackgroundOverlay = [0, 0, 0]

    constructor(main, height, width, overlayOpacity = 0.3) {
        this.main = main;
        this.height = height;
        this.width = width;
        this.overlayOpacity = overlayOpacity;

        this.overlayCreator = new OverlayCreator("modal-overlay");

        this.overlay;
    }

    create() {
        this.createOverlay();
        this.createModal();
        this.addListeners();
    }

    createModal() {
        throw new ("Implementation required in derived class");
    }

    addListeners() {
        throw new ("Implementation required in derived class");
    }

    createOverlay() {
        this.overlay = this.overlayCreator.create();
        this.main.appendChild(this.overlay);

        this.overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close();
            }
        });
    }

    open() {
        this.overlayCreator.open();
    }

    close() {
        this.overlayCreator.close();
    }
}

export default ModalBase