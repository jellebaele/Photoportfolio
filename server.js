const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes/routes");
const database = require("./configuration/database");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(morgan("combined"));

database.setupDatabase();

app.use(express.static("public"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/css", express.static(__dirname + "public/css"));

app.set("view engine", "ejs");
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
