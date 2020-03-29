const mongoose = require("mongoose");

// modèle devis pour mongoose DB
const Devis = mongoose.model("devis", {
  key: String,
  typeBien: Number,
  etatBien: Number,
  usageBien: Number,
  situationUser: Number,
  typeBienLib: String,
  etatBienLib: String,
  usageBienLib: String,
  situationUserLib: String,
  country: String,
  zipCode: String,
  montant: String,
  travaux: String,
  notaire: String,
  total: String,
  email: String
});

module.exports = Devis;
