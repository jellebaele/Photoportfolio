class ModalDOMCreator {
    constructor(className) {
        this.mainTag = document.createElement("div");
        this.mainTag.classList.add(className);
    }

    create() {
        throw new ("Implementation required in derived class");
    }

    clear() {
        this.mainTag.innerHTML = "";
    }
}

export default ModalDOMCreator;