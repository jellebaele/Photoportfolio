export default class createImageContainer {
   async createImageContainer(image, description) {
      const imageContainer = this.createImageContainerTag();

      let reader = new FileReader();
      return new Promise((resolve, reject) => {
         reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Unable to parse input file."));
         };

         reader.onload = (event) => {
            const imageTag = this.createImageTag();
            imageTag.src = event.target.result;
            imageContainer.appendChild(imageTag);
            imageContainer.appendChild(this.createContainerTag());
            imageContainer.appendChild(this.createTitleTag(image));
            imageContainer.appendChild(this.createBreakTag());
            imageContainer.appendChild(this.createSizeTag(image));
            imageContainer.appendChild(this.createBreakTag());
            imageContainer.appendChild(
               this.createImageDescriptionTag(image, description)
            );

            resolve(imageContainer);
         };
         reader.readAsDataURL(image);
      });
   }

   createImageContainerTag() {
      const imageContainer = document.createElement("div");
      imageContainer.setAttribute("class", "image-container fade");
      return imageContainer;
   }

   createImageTag() {
      return document.createElement("img");
   }

   createContainerTag() {
      const containerTag = document.createElement("p");
      containerTag.setAttribute("class", "container-text");

      const containerDeleteButton = document.createElement("button");
      containerDeleteButton.setAttribute("class", "container-button");

      const deleteIcon = document.createElement("i");
      deleteIcon.setAttribute("class", "fa fa-times-circle");
      deleteIcon.setAttribute("aria-hidden", "true");

      containerDeleteButton.appendChild(deleteIcon);
      containerTag.appendChild(containerDeleteButton);

      return containerTag;
   }

   createTitleTag(image) {
      const titleTag = document.createElement("input");
      titleTag.setAttribute("class", "img-title");
      titleTag.setAttribute("type", "text");
      titleTag.setAttribute("readonly", "true");
      titleTag.value = image.name;
      return titleTag;
   }

   createBreakTag() {
      return document.createElement("br");
   }

   createSizeTag(image) {
      const sizeTag = document.createElement("small");
      sizeTag.innerHTML = `<i>Size: ${this.convertBytesToKiloBytes(
         image.size
      )} KB</i>`;
      return sizeTag;
   }

   convertBytesToKiloBytes = (bytes) => {
      return Math.round(bytes * 0.001).toFixed(2);
   };

   createImageDescriptionTag(image, description) {
      const imageDescriptionTag = document.createElement("input");
      imageDescriptionTag.setAttribute("class", "image-description");
      imageDescriptionTag.setAttribute("id", image.id);
      imageDescriptionTag.setAttribute("type", "description");
      imageDescriptionTag.setAttribute("name", "image-description");
      imageDescriptionTag.setAttribute(
         "placeholder",
         "Beschrijving (optioneel)"
      );
      if (description !== undefined)
         imageDescriptionTag.setAttribute("value", description);
      else imageDescriptionTag.setAttribute("value", "");

      return imageDescriptionTag;
   }
}
