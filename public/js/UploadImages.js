import ImageContainerCreator from "./UploadImages/ImageContainerCreator.js";

const limitAmountUploadFiles = 10;
let imagesToUpload = []; 
let numberOfImagesToUpload = 0;
let selectedFilesTag = document.getElementById("selectedFilesTag");
const selectedFileNames = document.getElementById("fileNames");

document.getElementById("uploadButton").addEventListener("click", () => {
  selectedFilesTag.click();
});

selectedFilesTag.addEventListener("change", () => {
  try {
    addImagesToImagesToUpload(selectedFilesTag.files);
    selectedFileNames.innerHTML = selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
    drawImagesOnScreen(selectedFilesTag.files);
  } catch (error) {
    selectedFileNames.innerHTML = `<i>Opgelet!</i> Er kunnen slechts ${limitAmountUploadFiles} bestanden tegelijk ge-upload worden, er kunnen nog ${limitAmountUploadFiles - numberOfImagesToUpload} bestand(en) gekozen worden!`;
  }
});

let addImagesToImagesToUpload = (selectedImages) => {
  if (selectedImages.length + imagesToUpload.length > 10){
    throw "Too many images selected, maximum 10 are allowed";
  }
  
  for (let i = 0; i < selectedImages.length; i++) {
    imagesToUpload.push(selectedImages[i]);
  }

  numberOfImagesToUpload = imagesToUpload.length;

  console.log(imagesToUpload);
} 

let drawImagesOnScreen = (images) => {
  let container = document.getElementsByClassName("container")[0];
  let imageContainerCreator = new ImageContainerCreator(container);

  for (let i = 0; i < images.length; i++) {
    let currImage = images[i];
    imageContainerCreator.createImageContainer(currImage)
  }
};

let deleteImagesOnScreen = () => {
  let container = document.getElementsByClassName("container")[0];
  container.innerHTML = "";
};

document.getElementById("submit").addEventListener("click", () => {
  if (selectedFilesTag.value === "") {
    console.log("Leeg");
  } else {
    console.log(imagesToUpload);
  }
});