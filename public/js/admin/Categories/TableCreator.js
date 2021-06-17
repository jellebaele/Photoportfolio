class TableCreator {
    constructor(tableTag, searchUrl, popupHandler) {
        this.elements = {
            tableBody: tableTag.querySelector("#tableBody"),
            addButton: tableTag.querySelector("#createCategory"),
            deleteMultipleCategories: tableTag.querySelector("#deleteCategories")
        }

        this.searchUrl = searchUrl;
        this.popupHandler = popupHandler;
        this.title = '';
        this.addEventListeners();
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

    addEventListeners() {
        this.elements.addButton.addEventListener('click', () => {
            let answ = window.prompt('Naam nieuwe categorie:');
            if (answ !== null && answ.length > 0) {
                this.createNewCategory(answ);
            }
        });
    }

    async getAllCategories(query, limit) {
        return await fetch(`${this.searchUrl}?limit=${limit}&search=${query}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Er ging iets fout bij het ophalen van de categoriën!");
                }
                return response.json();
            })
            .then((response) => {
                return response;
            })
            .catch((error) => this.popupHandler.showWarning(error.message))
    }

    async createNewCategory(title) {
        return await fetch(`${this.searchUrl}?categoryTitle=${title}`, {
            method: "POST"
        })
            .then(response => {
                console.log(response.status);
                if (response.status !== 201) {
                    throw new Error(`Er ging iets fout bij het creëeren van een nieuwe categorie met title '${title}'!`);
                }
                return response.json()
            })
            .then(response => {
                this.GenerateTable();
                this.popupHandler.showSucces(`Nieuwe categorie met title '${response.newCategory.title}' succesvol aangemaakt!`)
            })
            .catch(error => this.popupHandler.showWarning(error.message))
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
        const tdTitle = this.elements.tableBody.querySelector(`#tdTableTitle_${id}`);
        const titleInputTag = tdTitle.querySelector('.td-title-input');
        this.title = titleInputTag.value;

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
        const tdTitle = this.elements.tableBody.querySelector(`#tdTableTitle_${id}`);
        const titleInputTag = tdTitle.querySelector('.td-title-input');
        const editButton = this.elements.tableBody.querySelector(`#editButton_${id}`);

        titleInputTag.value = this.title;
        titleInputTag.blur();
        titleInputTag.classList.add("td-title-input--uneditable");

        while (titleInputTag.nextSibling) {
            tdTitle.removeChild(titleInputTag.nextSibling);
        }

        editButton.disabled = false;
    }

    deleteHandler(id, title) {
        if (confirm(`Wil je categorie '${title}' met alle bijhorende foto's verwijderen?`)) {
            this.deleteCategory(id, title)
                .then((response) => {
                    this.popupHandler.showSucces(`De categorie met titel '${title}' met alle bijhorende foto's is succesvol verwijderd!`);
                    return;
                })
                .catch(error => this.popupHandler.showWarning(error.message));
        }
    }

    saveNewTitle(id, oldTitle, newTitle) {
        if (confirm(`Wil je categorie '${oldTitle}' hernoemen naar '${newTitle}'?`)) {
            this.updateTitle(id, oldTitle, newTitle)
                .then(response => {
                    this.title = newTitle;
                    this.popupHandler.showSucces(`De categorie hernoemd naar '${newTitle}' en bijhorende ${response.updatedImages.nModified} foto('s) bijgewerkt!`)
                })
                .catch(error => {
                    this.popupHandler.showWarning(error.message);
                })
        } 
        this.cancelEdit(id);
        
    }

    async deleteCategory(id, title) {
        return await fetch(`${this.searchUrl}?id=${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`Er ging iets fout bij het verwijderen van categorie '${title}'!`);
                }
                return response.json();
            })
            .then(response => {
                this.GenerateTable();
            })
            .catch(error => {
                throw new Error(error.message)
            })
    }

    async updateTitle(id, oldTitle, newTitle) {
        return await fetch(`${this.searchUrl}/title?id=${id}&newTitle=${newTitle}`, {
            method: "PATCH"
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`Er ging iets fout bij het hernoemen van categorie '${oldTitle}'!`);
                }
                return response.json();
            })
            .then(response => {
                this.GenerateTable();
                return response;
            })
            .catch(error => {
                this.title = oldTitle;
                throw new Error(error.message)
            });
    }
}

export default TableCreator;