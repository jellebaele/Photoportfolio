import FadeCreator from "../dom/images/FadeCreator.js";
import ModalImageEditor from "../Dom/modal/DOMCreators/Implementation/ModalImageEditor/ModalImageEditor.js";
import Alert from "../popup/Alert.js";

const url = "/api/image"
const gallery = document.querySelector(".gallery");
const modalBase = document.querySelector(".modal-base")
const alertWarning = document.getElementById("alertWarning");
const alertSuccess = document.getElementById("alertSucces");

function init() {
    const alertHandler = new Alert(alertSuccess, alertWarning, undefined, 0, 0, 7000);

    const modalImageEditor = new ModalImageEditor(modalBase, 0, 0, 0.3, gallery, url, alertHandler);
    modalImageEditor.create();
}

init();