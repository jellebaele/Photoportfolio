class Popup {
    constructor(popupSucces, popupWarning, popupError, top, left) {
        this.popupSucces = popupSucces;
        this.popupWarning = popupWarning;
        this.popupError = popupError;
        this.top = top;
        this.left = left;


    }

    showSucces(message) {

    }

    hideSucces() {

    }

    showWarning(message) {
        this.showPopup(this.popupWarning);
    }

    hideWarning() {

    }

    showError(message) {

    }

    hideError() {

    }

    showPopup(popup) {
        popup.classList.remove("hide-pop-up");
        popup.classList.add("show-pop-up");
    }

    hidePopup(popup) {
        popup.classList.remove("hide-pop-up");
        popup.classList.add("show-pop-up");
    }
}

export default Popup;