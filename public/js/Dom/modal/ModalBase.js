class ModalBase {

    RGBBackgroundOverlay = [0, 0, 0]

    constructor(main, height, width, overlayOpacity = 0.3) {
        this.main = main;
        this.height = height;
        this.width = width;
        this.overlayOpacity = overlayOpacity;

        this.overlay;
    }

    create() {
        this.createTagElements();
        this.addListeners();
    }

    createTagElements() {
        throw new ("Implementation required in derived class");
    }
    
    addListeners () {
        throw new ("Implementation required in derived class"); 
    }

    createOverlay() {
        this.overlay = document.createElement("div");
        this.overlay.classList.add("details-modal");
        this.overlay.style.background = `rgba(${this.RGBBackgroundOverlay[0]},${this.RGBBackgroundOverlay[1]},${this.RGBBackgroundOverlay[2]},${this.overlayOpacity})`
    }

    open() {
        this.create();
        this.overlay.classList.add("open");
    }

    close() {
        this.overlay.classList.remove("open");
    }
}

export default ModalBase