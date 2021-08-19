import TableCreator from "./Categories/TableCreator.js";
import Popup from "../popup/Popup.js";

const table = document.querySelector(".table")
const searchUrl = "/api/categories";
const categoryEditorBaseUrl = "category-editor";
const popupWarning = document.getElementById("alertWarning");
const popupSuccess = document.getElementById("alertSucces");

const popupHandler = new Popup(popupSuccess, popupWarning, undefined, 0, 0, 7000);


function init() {
    let tableCreator = new TableCreator(table, searchUrl, popupHandler, categoryEditorBaseUrl);
    tableCreator.GenerateTable();
}

init();