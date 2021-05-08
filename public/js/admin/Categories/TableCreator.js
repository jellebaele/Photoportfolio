class TableCreator {
    constructor(tableTag, searchUrl) {
        this.elements = {
            tableBody: tableTag.querySelector("#tableBody")
        }

        this.searchUrl = searchUrl;
    }

    GenerateTable() {
        this.getAllCategories("", 50).then(categories => {
            this.clearTableContent();
            this.populateResults(categories);
        })

    }

    clearTableContent() {
        while (this.elements.tableBody.firstChild) {
            this.elements.tableBody.removeChild(this.elements.tableBody.firstChild);
        }
    }

    async getAllCategories(query, limit) {
        return await fetch(`${this.searchUrl}?limit=${limit}&search=${query}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Something went wrong with the search for categories");
                }
                return response.json();
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.error(error);
            })
    }

    populateResults(results) {
        for (const result of results) {
            const newRow = this.createRowElement(result);
            this.elements.tableBody.appendChild(newRow);
        }
    }

    createRowElement(result) {
        const rowTag = document.createElement("tr");
        rowTag.classList.add("tr-body");
        rowTag.id = result._id;

        const tdCheckbox = this.createTdCheckbox();
        const tdTitle = this.createTdTitle(result.title);
        const tdAmount = this.createTdAmount(result.title);
        const tdEditButton = this.createTdEditButton(result._id);
        const tdDeleteButton = this.createTdDeleteButton(result._id);

        rowTag.appendChild(tdCheckbox)
        rowTag.appendChild(tdTitle)
        rowTag.appendChild(tdAmount);
        rowTag.appendChild(tdEditButton);
        rowTag.appendChild(tdDeleteButton);

        return rowTag;
    }

    createTdCheckbox() {
        const tdCheckbox = document.createElement("td");
        tdCheckbox.classList.add("td-checkbox");

        const checkboxTag = document.createElement("input");
        checkboxTag.classList.add("table-checkbox");
        checkboxTag.type = "checkbox";

        tdCheckbox.appendChild(checkboxTag);
        return tdCheckbox;
    }

    createTdTitle(title) {
        const tdTitle = document.createElement("td");
        tdTitle.innerText = title;
        return tdTitle;
    }

    createTdAmount(amount) {
        const tdAmount = document.createElement("td");
        tdAmount.innerText = amount;
        return tdAmount;
    }

    createTdEditButton(id) {
        const tdButton = document.createElement("td");
        const editButton = this.createTdButton("table-edit", "fa fa-pencil", id);
        editButton.addEventListener("click", () => console.log(id));

        tdButton.appendChild(editButton);
        return tdButton;
    }

    createTdDeleteButton(id) {
        const tdButton = document.createElement("td");

        const spacer = document.createElement("div");
        spacer.classList.add("table-delete-spacer");

        const button = this.createTdButton("table-delete", "fa fa-trash", id);
        button.addEventListener("click", () => console.log(id));

        spacer.appendChild(button);
        tdButton.appendChild(spacer);
        return tdButton;
    }

    createTdButton(className, classIcon) {
        const button = document.createElement("button");
        button.classList.add(className);
        button.innerHTML = `<i class=\"${classIcon}\" aria-hidden=\"true\"></i>`;

        return button;
    }

    deleteHandler(id) {
        deleteCategory(id).then((response) => {

        }).catch(error => console.error(error))
    }

    async deleteCategory(id) {
        return await fetch()
    }
}

export default TableCreator;