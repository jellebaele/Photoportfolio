import TableCreator from "./Categories/TableCreator.js";
import Popup from "../popup/Popup.js";

const table = document.querySelector(".table")
const searchUrl = "/api/categories";
const popupWarning = document.getElementById("popupWarning");
const popupSuccess = document.getElementById("popupSucces");

const popupHandler = new Popup(popupSuccess, popupWarning, undefined, 0, 0, 7000);


function init() {
    let tableCreator = new TableCreator(table, searchUrl, popupHandler);
    tableCreator.GenerateTable();
}

init();