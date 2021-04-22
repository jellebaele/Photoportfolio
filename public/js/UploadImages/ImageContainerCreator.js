export default class createImageContainer {
   async CreateImageContainer(image, description) {
      console.log(description)
      const imageContainer = this.CreateImageContainerTag();

      let reader = new FileReader();
      return new Promise((resolve, reject) => {
         reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Unable to parse input file."));
         };

         reader.onload = (event) => {
            const imageTag = this.CreateImageTag();
            imageTag.src = event.target.result;
            imageContainer.appendChild(imageTag);
            imageContainer.appendChild(this.CreateContainerTag());
            imageContainer.appendChild(this.CreateTitleTag(image));
            imageContainer.appendChild(this.CreateBreakTag());
            imageContainer.appendChild(this.CreateSizeTag(image));
            imageContainer.appendChild(this.CreateBreakTag());
            imageContainer.appendChild(this.CreateImageDescriptionTag(image));

            resolve(imageContainer);
         };
         reader.readAsDataURL(image);
      });
   }

   CreateImageContainerTag() {
      const imageContainer = document.createElement("div");
      imageContainer.setAttribute("class", "image-container fade");
      return imageContainer;
   }

   CreateImageTag() {
      return document.createElement("img");
   }

   CreateContainerTag() {
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

   CreateTitleTag(image) {
      const titleTag = document.createElement("input");
      titleTag.setAttribute("class", "img-title");
      titleTag.setAttribute("type", "text");
      titleTag.setAttribute("readonly", "true");
      titleTag.value = image.name;
      return titleTag;
   }

   CreateBreakTag() {
      return document.createElement("br");
   }

   CreateSizeTag(image) {
      const sizeTag = document.createElement("small");
      sizeTag.innerHTML = `<i>Size: ${this.ConvertBytesToKiloBytes(
         image.size
      )} KB</i>`;
      return sizeTag;
   }

   ConvertBytesToKiloBytes = (bytes) => {
      return Math.round(bytes * 0.001).toFixed(2);
   };

   CreateImageDescriptionTag(image) {
      const imageDescriptionTag = document.createElement("input");
      imageDescriptionTag.setAttribute("class", "image-description");
      imageDescriptionTag.setAttribute("id", image.id);
      imageDescriptionTag.setAttribute("type", "description");
      imageDescriptionTag.setAttribute("name", "image-description");
      imageDescriptionTag.setAttribute(
         "placeholder",
         "Beschrijving (optioneel)"
      );
      imageDescriptionTag.setAttribute("value", "");
      return imageDescriptionTag;
   }
}
