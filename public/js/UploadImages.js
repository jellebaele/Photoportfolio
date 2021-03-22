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
    selectedFileNames.innerHTML = `<i>Opgelet!</i> Er kunnen slechts ${limitAmountUploadFiles} bestanden tegelijk ge-upload worden, er kunnen nog ${
      limitAmountUploadFiles - numberOfImagesToUpload
    } bestand(en) gekozen worden!`;
  }
});

let addImagesToImagesToUpload = (selectedImages) => {
  if (selectedImages.length + imagesToUpload.length > 10) {
    throw "Too many images selected, maximum 10 are allowed";
  }

  for (let i = 0; i < selectedImages.length; i++) {
    selectedImages[i].id = imagesToUpload.length;
    imagesToUpload.push(selectedImages[i]);
  }
  numberOfImagesToUpload = imagesToUpload.length;
};

async function drawImagesOnScreen(images) {
  let container = document.getElementsByClassName("container")[0];
  let imageContainerCreator = new ImageContainerCreator();

  for (let i = 0; i < images.length; i++) {
    let currImage = images[i];
    let img = await imageContainerCreator.createImageContainer(
      currImage,
      imagesToUpload
    );

    let titleTag = img.children[2];

    let editButton = img.children[1].children[0];
    editButton.addEventListener("click", () =>
      editHandler(titleTag, currImage)
    );

    let deleteButton = img.children[1].children[1];
    deleteButton.addEventListener("click", () => deleteHandler(currImage.id));

    container.appendChild(img);
  }
}

let deleteHandler = (index) => {
  imagesToUpload.splice(index, 1);
  for (let i = 0; i < imagesToUpload.length; i++) {
    imagesToUpload[i].id = i;
  }
  deleteImagesOnScreen();
  drawImagesOnScreen(imagesToUpload);
  numberOfImagesToUpload = imagesToUpload.length;
  selectedFileNames.innerHTML = selectedFileNames.innerHTML = `${numberOfImagesToUpload} bestand(en) geselecteerd`;
};

let editHandler = (titleTag, image) => {
  titleTag.setAttribute("contenteditable", "true");
  titleTag.focus();
  // TODO titleTag on enter -> save  
};

let deleteImagesOnScreen = () => {
  let container = document.getElementsByClassName("container")[0];
  container.innerHTML = "";
};

document.getElementById("submit").addEventListener("click", () => {
  if (imagesToUpload.length < 1) {
    console.log("Leeg");
  } else {
    console.log(imagesToUpload);
  }
});
