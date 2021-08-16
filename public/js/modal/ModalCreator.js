class ModalCreator {
  constructor(modal, previews, fullImage) {
    this.modal = modal;
    this.previews = previews;
    this.fullImage = fullImage;
  }

  addEventListeners() {
    this.previews.forEach(preview => {
      preview.addEventListener('click', () => {
        this.modal.classList.add("open");
        this.fullImage.classList.add("open");

        const preload = document.querySelector('.preload');
        preload.classList.remove('preload-finish');

        const originalSource = preview.getAttribute("data-original");
        this.fullImage.src = originalSource;

        this.fullImage.onload = () => {
          preload.classList.add('preload-finish');
        }
      })
    });

    this.modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.modal.classList.remove('open');
        this.fullImage.classList.remove('open');
        this.fullImage.src = ""
      }
    });
  }
}

export default ModalCreator;