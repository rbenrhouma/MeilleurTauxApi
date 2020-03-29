const express = require("express");
const router = express.Router();
const fs = require("fs");

// On ajoute un prefix aux routes qu'on recupere via le require
router.use("/devis", require("./_devis"));

module.exports = router;
