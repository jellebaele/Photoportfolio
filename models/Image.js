const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  title: {
    type: String,
  },
  img: {
    path: String,
  },
  category: {
    type: String,
    default: 'uncategorised'
  }
});

const image = mongoose.model("Image", ImageSchema);
module.exports = image;