const mongoose = require("mongoose");
require('dotenv').config();

function setup() {
  mongoose.connect(
    process.env.DATABASE_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    () => {
      console.log("Connected to db");
    }
  );
}

module.exports = { setup };
