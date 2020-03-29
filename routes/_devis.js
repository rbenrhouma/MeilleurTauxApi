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
    const devis = await Devis.findById(req.query.id);
    //Envoyer le devis au client
    res.send(devis);
  } catch (err) {
    res.status(400).send({ message: "Error during fetching process" });
  }
});

// Route de create d'un devis
router.post("/save", async (req, res) => {
  console.log(req.body.typeBien);
  if (
    req.body.typeBien &&
    req.body.montant &&
    req.body.country &&
    req.body.zipCode &&
    req.body.email &&
    req.body.total !== undefined
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

      typeBien: req.body.typeBien,
      etatBien: req.body.etatBien,
      usageBien: req.body.usageBien,
      situationUser: req.body.situationUser,
      typeBienLib: req.body.typeBienLib,
      etatBienLib: req.body.etatBienLib,
      usageBienLib: req.body.usageBienLib,
      situationUserLib: req.body.situationUserLib,
      country: req.body.country,
      zipCode: req.body.zipCode,
      montant: req.body.montant,
      travaux: req.body.travaux,
      notaire: req.body.notaire,
      total: req.body.total,
      email: req.body.email
    });
    // Sauvegarde de devis + envois de mail
    try {
      await newDevis.save();
      // envois au client
      res.send(newDevis);
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "Error during saving process" });
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
