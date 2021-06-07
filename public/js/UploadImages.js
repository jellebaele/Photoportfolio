import ImageContainerCreator from "./UploadImages/ImageContainerCreator.js";
import ImageRemover from "./UploadImages/ImageRemover.js";
import CategorySearcher from "./UploadImages/CategorySearcher.js";
import Popup from "./popup/Popup.js";

const MAX_AMOUNT_IMAGES = 10;
let imagesToUpload = [];
let numberOfImagesToUpload = 0;

let selectedFilesTag = document.getElementById("selectedFilesTag");
let selectedFileNames = document.getElementById("fileNames");
let searchCategories = document.getElementById("searchCategories");
let popupWarning = document.getElementById("popupWarning")

const imageContainerCreator = new ImageContainerCreator();
const imageRemover = new ImageRemover();

const searchUrl = "/api/categories";
const categorySearcher = new CategorySearcher(searchCategories, searchUrl, 5);
categorySearcher.addListeners();

const popupHandler = new Popup(undefined, popupWarning, undefined, 0, 0);

document.getElementById("uploadButton").addEventListener("click", () => {
   selectedFilesTag.click();
});

selectedFilesTag.addEventListener("change", () => {
   try {
      addImagesToListImagesToUpload(selectedFilesTag.files);
      selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
      drawImagesOnScreen(selectedFilesTag.files);
   } catch (error) {
      selectedFileNames.innerHTML = `<i>Opgelet!</i> Er kunnen slechts ${MAX_AMOUNT_IMAGES} bestanden tegelijk ge-upload worden, er kunnen nog ${MAX_AMOUNT_IMAGES - numberOfImagesToUpload
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
      const descriptions = appendDescriptionToImages();
      let formData = new FormData();

      let category = document.getElementById("categoriesInput");
      formData.append("category", category.value);
      formData.append("descriptions", descriptions);

      for (let i = 0; i < imagesToUpload.length; i++) {
         formData.append("files", imagesToUpload[i]);
      }

      fetch(`/api/upload?categoryTitle=${category.value}`, {
         method: "POST",
         body: formData,
      }).then(response => {
         if (response.status === 200) {
            return response.json();
         } else {
            // Show warning popup
         }
      })
         .then(response => {
            console.log(response);
            window.scrollTo({ top: 0, behavior: "smooth" });

            setTimeout(() => {
               imageRemover.deleteAllImages(document.getElementsByClassName("container")[0]);
               imagesToUpload = [];
               numberOfImagesToUpload = 0;
               selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
               category.value = "";
               popupHandler.showWarning("");
               // popupWarning.classList.remove("hide-pop-up");
               // popupWarning.classList.add("show-pop-up");
            }, 500);
         });
   }
});

function appendDescriptionToImages() {
   let descriptions = [];
   const descriptionTags = document.getElementsByClassName("image-description");
   for (let i = 0; i < descriptionTags.length; i++) {
      descriptions.push(descriptionTags[i].value);
   }
   return descriptions;
}
