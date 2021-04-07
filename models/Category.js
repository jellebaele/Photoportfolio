const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  title: {
    type: String,
  },
  amountOfPictures: Number,
});

const category = mongoose.model("Category", CategorySchema);
module.exports = category;