import TableCreator from "./Categories/TableCreator.js";
import Alert from "../popup/Alert.js";

const table = document.querySelector(".table")
const searchUrl = "/api/categories";
const categoryEditorBaseUrl = "category-editor";
const alertWarning = document.getElementById("alertWarning");
const alertSuccess = document.getElementById("alertSucces");

const alertHandler = new Alert(alertSuccess, alertWarning, undefined, 0, 0, 7000);


function init() {
    let tableCreator = new TableCreator(table, searchUrl, alertHandler, categoryEditorBaseUrl);
    tableCreator.GenerateTable();
}

init();