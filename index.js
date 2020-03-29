const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/product-catalog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// On recupere le router du fichier ./routes/index.js
const routes = require("./routes/");

// On l'utilise
app.use(routes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// si aucune page n'est disponible.
app.all("*", (req, res) => {
  res.status(404).send("Page introuvable dans products ...");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started trop cool");
});
