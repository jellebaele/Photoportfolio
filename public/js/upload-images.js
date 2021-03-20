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
    for (let i = 0; i < images.length; i++) {
        let image = document.createElement("img");
        let reader = new FileReader();

        reader.onload = (event) => {
            image.src = event.target.result;
            document.body.appendChild(image);
        }
              
        reader.readAsDataURL(images[i]);
    }
}

let deleteImagesOnScreen = () => {
  
}

document.getElementById("submit").addEventListener("click", () => {
  if (selectedFilesTag.value === "") {
    console.log("Leeg");
  } else {
    console.log(selectedFilesTag.files);
  }
});
