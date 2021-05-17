class TableCreator {
    constructor(tableTag, searchUrl) {
        this.elements = {
            tableBody: tableTag.querySelector("#tableBody")
        }

        this.searchUrl = searchUrl;
        this.title = '';
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
        const tdAmount = this.createTdAmount(result.amountOfPictures);
        const tdEditButton = this.createTdEditButton(result._id);
        const tdDeleteButton = this.createTdDeleteButton(result._id, result.title);

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

        const inputText = document.createElement("input");
        inputText.classList.add("td-title-input");
        inputText.classList.add("td-title-input--uneditable");
        inputText.type = "text";
        inputText.value = title;

        this.title = title;
        inputText.addEventListener('keyup', e => this.titleKeyUphandler(e, inputText));

        tdTitle.appendChild(inputText);
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
        editButton.addEventListener("click", () => this.editHandler(id));

        tdButton.appendChild(editButton);
        return tdButton;
    }

    createTdDeleteButton(id, title) {
        const tdButton = document.createElement("td");

        const spacer = document.createElement("div");
        spacer.classList.add("table-delete-spacer");

        const button = this.createTdButton("table-delete", "fa fa-trash", id);
        button.addEventListener("click", () => this.deleteHandler(id, title));

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

    titleKeyUphandler(e, inputElement) {
        console.log(e);
        if (e.key === 'Escape') {
            inputElement.value = this.title;
            inputElement.blur();
            inputElement.classList.add("td-title-input--uneditable");
        } else if (e.key === 'Enter') {
            // Update category
        }
    }

    editHandler(id) {
        const tdTitle = this.elements.tableBody.querySelector('.td-title-input');
        tdTitle.classList.remove("td-title-input--uneditable");
        tdTitle.select();
    }

    deleteHandler(id, title) {
        if (confirm(`Wil je categorie '${title}' verwijderen?`)) {
            this.deleteCategory(id).then((response) => {
                console.log("Category deleted succesfully");
            }).catch(error => console.error(error))
        } else {
            console.log("Category not deleted");
        }

    }

    async deleteCategory(id) {
        return await fetch(`${this.searchUrl}?id=${id}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(response => {
                console.log(response.status);
                this.GenerateTable();
            })
            .catch(error => console.error(error))
    }
}

export default TableCreator;