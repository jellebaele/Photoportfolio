import TableCreator from "./Categories/TableCreator.js";


// const tableBody = document.getElementById("tableBody");
const table = document.querySelector(".table-categories")
const searchUrl = "/api/categories";


function init() {
    let tableCreator = new TableCreator(table, searchUrl);
    tableCreator.GenerateTable();
}

init();