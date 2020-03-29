const express = require("express");
const router = express.Router();
const Devis = require("../models/Devis");
const generator = require("generate-password");

router.get("/", async (req, res) => {
  try {
    const Devis = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.get("/devis", async (req, res) => {
//   try {
//     //Recherche d'un devis à partir de ID
//     const devis = await Devis.findById(req.query.id);
//     //Envoyer le devis au client
//     res.send(devis);
//   } catch (err) {
//     res.status(400).send({ message: "Error during fetching process" });
//   }
// });

// Route de create d'un devis
router.post("/save", async (req, res) => {
  res.send("Devis !!!");
});

// router.put("/update", async (req, res) => {});

router.delete("/delete", async (req, res) => {
  try {
    const devis = await Devis.findOne({ _id: req.fields.id });
    if (devis) {
      await devis.remove();
      res.send("Devis supprimé avec succès");
    } else {
      res.status(400).send({ message: "Id du devis inexistant" });
    }
  } catch (err) {
    res.status(400).send({ message: "Erreur d'id" });
  }
});

module.exports = router;
