const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  title: {
    type: String,
  },
  img: {
    path: {
        type: String,
        default: "Not found"
    },
    mimetype: String,
    size: Number,
    encoding: String
  },
  category: {
    type: String,
    default: 'uncategorised'
  },
  index: Number
});

const image = mongoose.model("Image", ImageSchema);
module.exports = image;