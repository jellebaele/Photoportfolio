import FadeCreator from "../dom/images/FadeCreator.js";
import Alert from "../popup/Alert.js";

const url = "/api/image"
const gallery = document.querySelector(".gallery");
const alertWarning = document.getElementById("alertWarning");
const alertSuccess = document.getElementById("alertSucces");

function init() {
    const alertHandler = new Alert(alertSuccess, alertWarning, undefined, 0, 0, 7000);
    let fadeCreator = new FadeCreator(url, gallery, alertHandler);
    fadeCreator.addListeners();
}

init();