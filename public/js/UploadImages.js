import ImageContainerCreator from "./UploadImages/ImageContainerCreator.js";
import ImageRemover from "./UploadImages/ImageRemover.js";

const MAX_AMOUNT_IMAGES = 10;
let imagesToUpload = [];
let numberOfImagesToUpload = 0;
let selectedFilesTag = document.getElementById("selectedFilesTag");
let selectedFileNames = document.getElementById("fileNames");
const imageContainerCreator = new ImageContainerCreator();
const imageRemover = new ImageRemover();

document.getElementById("uploadButton").addEventListener("click", () => {
   selectedFilesTag.click();
});

selectedFilesTag.addEventListener("change", () => {
   try {
      addImagesToListImagesToUpload(selectedFilesTag.files);
      selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
      drawImagesOnScreen(selectedFilesTag.files);
   } catch (error) {
      selectedFileNames.innerHTML = `<i>Opgelet!</i> Er kunnen slechts ${MAX_AMOUNT_IMAGES} bestanden tegelijk ge-upload worden, er kunnen nog ${
         MAX_AMOUNT_IMAGES - numberOfImagesToUpload
      } bestand(en) gekozen worden.`;
   }
});

function addImagesToListImagesToUpload(selectedImages) {
   if (selectedImages.length + imagesToUpload.length > 10) {
      throw "Too many images selected, maximum 10 are allowed";
   }

   for (let i = 0; i < selectedImages.length; i++) {
      selectedImages[i].id = imagesToUpload.length;
      imagesToUpload.push(selectedImages[i]);
   }
   numberOfImagesToUpload = imagesToUpload.length;
}

async function drawImagesOnScreen(images, descriptions) {
   let container = document.getElementsByClassName("container")[0];

   for (let i = 0; i < images.length; i++) {
      let currImage = images[i];
      let img;
      if (descriptions !== undefined) {
         img = await imageContainerCreator.createImageContainer(images[i], descriptions[i]);
      } else {
         img = await imageContainerCreator.createImageContainer(currImage);
      }

      container.appendChild(img);

      let titleTag = img.children[2];
      titleTag.style.width = `${document
         .querySelector(".image-container")
         .clientWidth.toString()}px`;

      let deleteButton = img.children[1].children[0];
      deleteButton.addEventListener("click", () => deleteHandler(currImage.id));
   }
}

function deleteHandler(index) {
   imagesToUpload = imageRemover.deleteImage(imagesToUpload, index);
   let imageDescriptionTags = document.getElementsByClassName("image-description");
   let imageDescriptions = imageRemover.getNewImageDescriptions(imageDescriptionTags, index);

   imageRemover.deleteAllImages(document.getElementsByClassName("container")[0]);

   drawImagesOnScreen(imagesToUpload, imageDescriptions);
   numberOfImagesToUpload = imagesToUpload.length;
   selectedFileNames.innerHTML = selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
}

document.getElementById("submit").addEventListener("click", () => {
   if (imagesToUpload.length < 1) {
      alert("Geen bestanden geselecteerd!");
   } else {
      appendDescriptionToImages();
      let formData = new FormData();

      let category = document.getElementById("inputTextCategory");
      formData.append("category", category.value);

      for (let i = 0; i < imagesToUpload.length; i++) {
         console.log(imagesToUpload[i]);
         formData.append("files", imagesToUpload[i]);
      }

      fetch("/api/upload", {
         method: "POST",
         body: formData,
      }).then((data) => {
         imageRemover.deleteAllImages(document.getElementsByClassName("container")[0]);
         imagesToUpload = [];
         numberOfImagesToUpload = 0;
         selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
      });
   }
});

function appendDescriptionToImages() {
   console.log("Test");
   let descriptions = document.getElementsByClassName("image-description");
   for (let i = 0; i < descriptions.length; i++) {
      imagesToUpload[i].description = descriptions[i].value;
   }
}
