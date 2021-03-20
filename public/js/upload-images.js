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
  for (let i = 0; i < images.length; i++) {
    let currImage = images[i];
    
    let imageContainer = document.createElement("div");
    imageContainer.setAttribute("class", "image-container");

    let image = document.createElement("img");
    let titleTag = document.createElement("p");
    titleTag.setAttribute("class", "img-title");
    titleTag.innerHTML = currImage.name;
    let sizeTag = document.createElement("small");
    sizeTag.innerHTML = `<i>Size: ${convertBytesToKiloBytes(currImage.size)} KB</i>`;

    let reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      imageContainer.appendChild(image);
      imageContainer.appendChild(titleTag);
      imageContainer.appendChild(sizeTag)
      container.appendChild(imageContainer);
    };

    reader.readAsDataURL(currImage);
  }
};

let deleteImagesOnScreen = () => {
  let container = document.getElementsByClassName("container")[0];
  container.innerHTML = "";
};

let convertBytesToKiloBytes = (bytes) => {
  return Math.round(bytes * 0.001).toFixed(2);
} 

document.getElementById("submit").addEventListener("click", () => {
  if (selectedFilesTag.value === "") {
    console.log("Leeg");
  } else {
    console.log(imagesToUpload);
  }
});
