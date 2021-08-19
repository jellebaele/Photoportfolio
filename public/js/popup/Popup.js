class Alert {
    constructor(alertSucces, alertWarning, alertError, top, left, timeOut = 5000) {
        this.alertSucces = alertSucces;
        this.alertWarning = alertWarning;
        this.alertError = alertError;
        this.top = top;
        this.left = left;
        this.timeOut = timeOut;

        this.addEventlisteners();
    }

    addEventlisteners() {
        this.alertSucces.querySelector(".close-button").addEventListener('click', () => {
            this.hideAlert(this.alertSucces);
        });
        this.alertWarning.querySelector(".close-button").addEventListener('click', () => {
            this.hideAlert(this.alertWarning);
        });
    }

    showSucces(message) {
        this.showAlert(this.alertSucces, `Succes! ${message}`);
    }

    showWarning(message) {
        this.showAlert(this.alertWarning, `Warning! ${message}`);
    }

    showError(message) {
        this.showAlert(this.alertError);
    }

    showAlert(alert, message) {
        alert.classList.remove("hide-alert");
        alert.classList.add("show-alert");
        alert.classList.add("alert-show");

        alert.querySelector(".message-title").innerHTML = message;

        setTimeout(() => {
            this.hideAlert(alert);
        }, this.timeOut)
    }

    hideAlert(alert) {
        alert.classList.remove("show-alert");
        alert.classList.add("hide-alert");
    }
}

export default Alert;