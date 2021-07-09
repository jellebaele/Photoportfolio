const multer = require('multer');
const UploadDirectory = require('../general/UploadDirectory');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
       callback(null, UploadDirectory.getOriginalImageDirectory(req.body.category));
    },
    filename: (req, file, callback) => {
       const match = ["image/png", "image/jpeg"];
       if (match.indexOf(file.mimetype) === -1) {
          return callback(new Error(`'${file.originalname}' is invalid. Only .png/.jpeg files are accepted`), null);
       }
 
       let filename = file.originalname.replace(/[{}><*$µ£`()\´#^¨|\[\]]/gi, "");
       callback(null, filename);
    },
 });

 module.exports = storage;