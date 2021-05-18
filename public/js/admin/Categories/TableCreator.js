class TableCreator {
    constructor(tableTag, searchUrl) {
        this.elements = {
            tableBody: tableTag.querySelector("#tableBody"),
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

        rowTag.appendChild(this.createTdCheckbox())
        rowTag.appendChild(this.createTdTitle(result.title, result._id))
        rowTag.appendChild(this.createTdAmount(result.amountOfPictures));
        rowTag.appendChild(this.createTdEditButton(result._id));
        rowTag.appendChild(this.createTdDeleteButton(result._id, result.title));

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

    createTdTitle(title, id) {
        const tdTitle = document.createElement("td");
        tdTitle.id = `tdTableTitle_${id}`
        const inputText = document.createElement("input");
        inputText.classList.add("td-title-input");
        inputText.classList.add("td-title-input--uneditable");
        inputText.type = "text";
        inputText.value = title;

        this.title = title;
        inputText.addEventListener('keyup', e => this.titleKeyUpHandler(e, inputText));

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
        editButton.addEventListener("click", () => this.editHandler(id, editButton));

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

    createTdButton(className, classIcon, id) {
        const button = document.createElement("button");
        button.classList.add(className);
        button.id = `editButton_${id}`
        button.innerHTML = `<i class=\"${classIcon}\" aria-hidden=\"true\"></i>`;

        return button;
    }

    titleKeyUpHandler(e, titleInputTag) {        
        if (e.key === 'Escape') {
            const id = titleInputTag.parentElement.parentElement.id;
            this.cancelEdit(id);
        } else if (e.key === 'Enter') {
            const id = titleInputTag.parentElement.parentElement.id;
            this.saveNewTitle(id, this.title, titleInputTag.value);
        }
    }

    editHandler(id, editButton) {
        const titleInputTag = this.elements.tableBody.querySelector('.td-title-input');
        const tdTitle = this.elements.tableBody.querySelector(`#tdTableTitle_${id}`);

        editButton.disabled = true;
        titleInputTag.classList.remove("td-title-input--uneditable");
        titleInputTag.select();

        const editAcceptButton = this.createTdButton('table-edit', 'fa fa-check');
        editAcceptButton.addEventListener('click', () => this.saveNewTitle(id, this.title, titleInputTag.value));

        const editCancelButton = this.createTdButton('table-edit', 'fa fa-times');
        editCancelButton.addEventListener('click', () => this.cancelEdit(id));

        tdTitle.appendChild(editAcceptButton);
        tdTitle.appendChild(editCancelButton);
    }

    cancelEdit(id) {
        const titleInputTag = this.elements.tableBody.querySelector('.td-title-input');
        const editButton = this.elements.tableBody.querySelector(`#editButton_${id}`);
        const tdTitle = this.elements.tableBody.querySelector(`#tdTableTitle_${id}`);

        titleInputTag.value = this.title;
        titleInputTag.blur();
        titleInputTag.classList.add("td-title-input--uneditable");

        while (titleInputTag.nextSibling) {
            tdTitle.removeChild(titleInputTag.nextSibling);
        }

        editButton.disabled = false;
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

    saveNewTitle(id, oldTitle, newTitle) {
        if (confirm(`Wil je categorie ${oldTitle} hernoemen naar ${newTitle}?`)) {
            this.updateTitle(id, newTitle).then(response => {
                console.log('Category updated succesfully');
                this.title = newTitle;
                this.cancelEdit(id);
            })
        } else {
            this.cancelEdit(id);
        }
    }

    async updateTitle(id, newTitle) {
        return await fetch(`${this.searchUrl}/title?id=${id}&newTitle=${newTitle}`, {
            method: "PATCH"
        })
            .then(response => response.json())
            .then(response => {
                console.log(response.status);
                this.GenerateTable();
            })
            .catch(error => console.error(error));
    }
}

export default TableCreator;