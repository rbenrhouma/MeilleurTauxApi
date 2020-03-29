const express = require("express");
const router = express.Router();
const Devis = require("../models/Devis");
const generator = require("generate-password");

router.get("/", async (req, res) => {
  try {
    const allDevis = await Devis.find();
    res.json(allDevis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/devis", async (req, res) => {
  try {
    //Recherche d'un devis à partir de ID
    console.log("get all devis");
    const devis = await Devis.findById(req.query.id);
    //Envoyer le devis au client
    res.send(devis);
  } catch (err) {
    res.status(400).send({ message: "Error during fetching process" });
  }
});

// Route de create d'un devis
router.post("/save", async (req, res) => {
  console.log("Début de save de devis");
  if (
    req.body.zipCode &&
    req.body.email &&
    req.body.typeBien &&
    req.body.etatBien &&
    req.body.total !== undefined &&
    req.body.montant !== undefined
  ) {
    //Creation d'un nouveau Devis
    const newDevis = new Devis({
      //Generation number alléatoire
      key: generator.generate({
        length: 8,
        numbers: true,
        uppercase: false,
        exclude: "abcdefghijklmnopqrstuvwxyz"
      }),

      zipCode: req.body.zipCode,
      email: req.body.email,
      typeBien: req.body.typeBien,
      etatBien: req.body.etatBien,
      total: req.body.total,
      montant: req.body.montant,
      usageBien: req.body.usageBien ? req.body.usageBien : "0",
      situationUser: req.body.situationUser ? req.body.situationUser : "",
      typeBienLib: req.body.typeBienLib ? req.body.typeBienLib : "",
      etatBienLib: req.body.etatBienLib ? req.body.etatBienLib : "",
      usageBienLib: req.body.usageBienLib ? req.body.usageBienLib : ":",
      situationUserLib: req.body.situationUserLib
        ? req.body.situationUserLib
        : "",
      notaire: req.body.notaire ? req.body.notaire : "0"
    });
    // Sauvegarde de devis + envois de mail
    try {
      await newDevis.save();
      // envois au client
      res.send(newDevis);
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: "Error during saving process of saving devis" });
    }
  } else {
    res.status(400).send({ message: "Some parameters are missing" });
  }
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
