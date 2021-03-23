const express = require('express');
const routes = require("./routes/routes");
const app = express();

app.use(express.static('public'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/css', express.static(__dirname + 'public/css'))

app.set('view engine', 'ejs');
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});