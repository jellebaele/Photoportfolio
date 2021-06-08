class Popup {
    constructor(popupSucces, popupWarning, popupError, top, left, timeOut = 5000) {
        this.popupSucces = popupSucces;
        this.popupWarning = popupWarning;
        this.popupError = popupError;
        this.top = top;
        this.left = left;
        this.timeOut = timeOut;

        this.addEventlisteners();
    }

    addEventlisteners() {
        this.popupSucces.querySelector(".close-button").addEventListener('click', () => {
            this.hidePopup(this.popupSucces);
        });
        this.popupWarning.querySelector(".close-button").addEventListener('click', () => {
            this.hidePopup(this.popupWarning);
        });
    }

    showSucces(message) {
        this.showPopup(this.popupSucces, `Succes! ${message}`);
    }

    showWarning(message) {
        this.showPopup(this.popupWarning, `Warning! ${message}`);
    }

    showError(message) {
        this.showPopup(this.popupError);
    }

    showPopup(popup, message) {
        popup.classList.remove("hide-pop-up");
        popup.classList.add("show-pop-up");
        popup.classList.add("alert-show");

        popup.querySelector(".message-title").innerHTML = message;

        setTimeout(() => {
            this.hidePopup(popup);
        }, this.timeOut)
    }

    hidePopup(popup) {
        popup.classList.remove("show-pop-up");
        popup.classList.add("hide-pop-up");
    }
}

export default Popup;