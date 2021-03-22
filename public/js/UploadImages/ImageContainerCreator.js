import HtmlTagGenerator from "../Dom/HtmlTagGenerator.js"

export default class createImageContainer {
    constructor(parentTag) {
        this.parentTag = parentTag;
        this.htmlTagGenerator = new HtmlTagGenerator;
      }
    
      async createImageContainer(image) {
        const imageContainer = document.createElement("div");
        imageContainer.setAttribute("class", "image-container fade");
    
        const imageTag = document.createElement("img");
    
        const containerText = document.createElement("p");
        containerText.setAttribute("class", "container-text");
    
        const containerEditButton = this.htmlTagGenerator.createTag(
          "button",
          {
            class: "container-button",
          },
          "Edit"
        );
    
        const containerDeleteButton = document.createElement("button");
        containerDeleteButton.setAttribute("class", "container-button");
        const deleteIcon = document.createElement("i");
        deleteIcon.setAttribute("class", "fa fa-times-circle");
        deleteIcon.setAttribute("aria-hidden", "true");
    
        containerDeleteButton.appendChild(deleteIcon);
        containerText.appendChild(containerEditButton);
        containerText.appendChild(containerDeleteButton);
    
        const titleTag = document.createElement("p");
        titleTag.setAttribute("class", "img-title");
        titleTag.innerHTML = image.name;
        const sizeTag = document.createElement("small");
        sizeTag.innerHTML = `<i>Size: ${this.convertBytesToKiloBytes(
          image.size
        )} KB</i>`;
    
        let reader = new FileReader();
        
        reader.onload = (event) => {
          imageTag.src = event.target.result;
          imageContainer.appendChild(imageTag);
          imageContainer.appendChild(containerText);
          imageContainer.appendChild(titleTag);
          imageContainer.appendChild(sizeTag)
        
          return this.parentTag.appendChild(imageContainer);
        };
    
        reader.readAsDataURL(image);
      }

      convertBytesToKiloBytes = (bytes) => {
        return Math.round(bytes * 0.001).toFixed(2);
      } 
}