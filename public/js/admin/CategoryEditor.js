import FadeCreator from "../dom/images/FadeCreator.js";
import Alert from "../popup/Alert.js";

const url = "/api/image"
const gallery = document.querySelector(".gallery");
const popupWarning = document.getElementById("alertWarning");
const popupSuccess = document.getElementById("alertSucces");

function init() {
    const popupHandler = new Alert(popupSuccess, popupWarning, undefined, 0, 0, 7000);
    let fadeCreator = new FadeCreator(url, gallery, popupHandler);
    fadeCreator.addListeners();
}

init();