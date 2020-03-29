const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/devis", {
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
  res.status(404).send("Page introuvable dans Devis ...");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at ${port} port trop cool ...`);
});
