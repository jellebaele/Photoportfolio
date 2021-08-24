import FadeCreator from "../dom/images/FadeCreator.js";
import Alert from "../popup/Alert.js";

const url = "/api/image"
const gallery = document.querySelector(".gallery");
const alertWarning = document.getElementById("alertWarning");
const alertSuccess = document.getElementById("alertSucces");

const textAreas = document.querySelectorAll("textarea");

function init() {
    const alertHandler = new Alert(alertSuccess, alertWarning, undefined, 0, 0, 7000);
    let imageFadeCreator = new FadeCreator(url, gallery, alertHandler);
    imageFadeCreator.addListeners();

    // const detailsModelCreator = new DetailsModalCreator();
    setupTextAreas(textAreas);
}

// ------ Split to different class ------
function setupTextAreas(textAreas) {
    textAreas.forEach(textArea => {
        resizeTextArea(textArea);
        textArea.addEventListener('keyup', (e) => {
            resizeTextArea(e.srcElement)
        });
        textArea.addEventListener('change', (e) => {
            resizeTextArea(e.srcElement)
        });
    });

}

function resizeTextArea(textArea) {
    let content = textArea.value;
    let columns = textArea.cols;

    let linecount = 0;
    content.split("\n").forEach(line => {
        linecount += Math.ceil(line.length / (columns * 2));
    });

    textArea.rows = linecount;
}

// ------ End split to different class ------

init();