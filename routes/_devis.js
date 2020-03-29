const express = require("express");
const router = express.Router();
const Devis = require("../models/Devis");

router.get("/", async (req, res) => {
  try {
    const Devis = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/save", async (req, res) => {});

router.put("/update", async (req, res) => {});

router.delete("/delete", async (req, res) => {
  try {
    const devisId = req.query.id;
    if (devisId) {
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
