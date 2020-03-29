const express = require("express");
const router = express.Router();
const fs = require("fs");

// On ajoute un prefix aux routes qu'on recupere via le require

fs.readdirSync("./routes/").forEach(f => {
  if (f[0] === "_" && f.slice(f.length - 3, f.length).toLowerCase() === ".js") {
    router.use("/" + f.slice(1, f.length - 3), require("./" + f.slice(0, f.length - 3)));
    //console.log(f);
  }
});

// On ajoute un prefix aux routes qu'on recupere via le require
// router.use("/department", require("./_department"));
// router.use("/category", require("./_category"));
// router.use("/product", require("./_product"));
// router.use("/review", require("./_review"));

module.exports = router;
