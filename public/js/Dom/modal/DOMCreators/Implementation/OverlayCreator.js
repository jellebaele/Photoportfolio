import ModalDOMCreator from "../Base/ModalDOMCreator.js"

class OverlayCreator extends ModalDOMCreator {
    RGBBackgroundOverlay = [0, 0, 0]
    
    constructor(className) {
        super(className);
    }

    create() {
        this.mainTag.style.background = `rgba(${this.RGBBackgroundOverlay[0]},${this.RGBBackgroundOverlay[1]},${this.RGBBackgroundOverlay[2]},${this.overlayOpacity})`
        return this.mainTag;
    }

    open() {
        this.mainTag.classList.add("open");
    }

    close() {
        this.mainTag.classList.remove("open");
    }
}

export default OverlayCreator;