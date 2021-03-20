const limitAmountUploadFiles = 10;
let selectedFilesTag = document.getElementById("selectedFilesTag");
const selectedFileNames = document.getElementById("fileNames");

document.getElementById("uploadButton").addEventListener("click", () => {
  selectedFilesTag.click();
});

selectedFilesTag.addEventListener("change", () => {
  let numberOfFiles = parseInt(selectedFilesTag.files.length);

  console.log(selectedFileNames.clientWidth);

  if (numberOfFiles == 1) {
    selectedFileNames.innerHTML = selectedFilesTag.files[0].name;
  } else if (numberOfFiles > 1 && numberOfFiles <= limitAmountUploadFiles) {
    selectedFileNames.innerHTML = `${numberOfFiles} bestanden geselecteerd`;
  } else {
    selectedFilesTag.value = "";
    selectedFileNames.innerHTML = `<i>Opgelet!</i> Er kunnen slechts ${limitAmountUploadFiles} bestanden tegelijk ge-upload worden! Probeer opnieuw...`;
  }

  drawImagesOnScreen(selectedFilesTag.files);
});

let drawImagesOnScreen = (images) => {
  let container = document.getElementsByClassName("container")[0];
  for (let i = 0; i < images.length; i++) {
    let currImage = images[i];
    
    let imageContainer = document.createElement("div");
    imageContainer.setAttribute("class", "image-container");

    let image = document.createElement("img");
    let title = document.createElement("p");
    title.setAttribute("class", "img-title");
    title.innerHTML = currImage.name;

    let reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      imageContainer.appendChild(image);
      imageContainer.appendChild(title);
      container.appendChild(imageContainer);
    };

    reader.readAsDataURL(currImage);
  }
};

let createImageElement = () => {};

let deleteImagesOnScreen = () => {};

document.getElementById("submit").addEventListener("click", () => {
  if (selectedFilesTag.value === "") {
    console.log("Leeg");
  } else {
    console.log(selectedFilesTag.files);
  }
});
