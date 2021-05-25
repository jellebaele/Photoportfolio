import TableCreator from "./Categories/TableCreator.js";

const table = document.querySelector(".table")
const searchUrl = "/api/categories";


function init() {
    let tableCreator = new TableCreator(table, searchUrl);
    tableCreator.GenerateTable();
}

init();