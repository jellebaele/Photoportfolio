export default class ImageRemover {
   deleteImage(imageListToRemoveFrom, index) {
      imageListToRemoveFrom.splice(index, 1);
      
      for (let i = 0; i < imageListToRemoveFrom.length; i++) {
        imageListToRemoveFrom[i].id = i;
      }

      return imageListToRemoveFrom;
   }

   getNewImageDescriptions (imageDescriptionTags, index) {
    let imageDescriptions = [];
    imageDescriptionTags[index].parentNode.removeChild(imageDescriptionTags[index]);
 
    for (let i = 0; i < imageDescriptionTags.length; i++) {
       imageDescriptions.push(imageDescriptionTags[i].value);
    }
    
    return imageDescriptions;
   }

   deleteAllImages(htmlElement) {
      htmlElement.innerHTML = "";
   }
}
