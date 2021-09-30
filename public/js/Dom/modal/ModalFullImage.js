import ModalBase from "./DOMCreators/Base/ModalBase.js"

class ModalFullImage extends ModalBase {
    constructor(main, height, width, overlayOpacity = 0.3, previews) {
        super(main, height, width, overlayOpacity);
        this.previews = previews;

        this.fullImage;
    }

    createModal() {
        this.fullImage = this.createFullImage();
        this.overlay.appendChild(this.fullImage);
    }

    createFullImage() {
        const imageTag = document.createElement("img");
        imageTag.src = "\\uploads\\Experimental\\resized\\cat-experimenteel.png";
        imageTag.alt = "";
        imageTag.classList.add("full-image-modal");

        return imageTag;
    }

    addListeners() {
        this.previews.forEach(preview => {
            preview.addEventListener('click', () => {
                this.open();

                const preload = document.querySelector('.preload');
                preload.classList.remove('preload-finish');

                const originalSource = preview.getAttribute("data-original");
                this.fullImage.src = originalSource;

                this.fullImage.onload = () => {
                    preload.classList.add('preload-finish');
                }
            })
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close();
            }
        });
    }

    open() {
        this.overlay.classList.add("open");
        this.fullImage.classList.add("open");
    }

    close() {
        this.overlay.classList.remove('open');
        this.fullImage.classList.remove('open');
        this.fullImage.src = "";
    }
}

export default ModalFullImage;