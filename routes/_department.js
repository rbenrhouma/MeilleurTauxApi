const express = require("express");
const router = express.Router();

// Recuperer le model Department
const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const departments = await Department.find(); // On recupere tous les Department
    res.json(departments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const title = req.body.title;
    if (title) {
      const department = new Department({
        title: title
      }); // On crée un Department avec comme title : req.body.title
      await department.save();
      res.json(department);
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const id = req.query.id;
    const title = req.body.title;
    if (id && title) {
      // on check si
      const department = await Department.findById(id); // Ici on recupere un département qui a comme id : req.body.id
      department.title = title; // Ici on met a jour le department qu'on a trouvé grace a l'id
      await department.save();
      res.json(department);
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const departmentId = req.query.id;
    if (departmentId) {
      // Ici on recupere un département qui a comme id : departmentId
      const department = await Department.findById(departmentId);

      if (department) {
        // On recupere toute les categories qui lui sont associées
        const categoryToRemove = await Category.find({
          department: departmentId
        });

        // On parcourt toute les categories
        for (let i = 0; i < categoryToRemove.length; i++) {
          // Pour chacune d'elles on supprime tous ses produits
          await Product.deleteMany({ category: categoryToRemove[i]._id });
          // Puis on la supprime
          await categoryToRemove[i].remove();
        }

        // On supprime enfin le departement
        await department.remove();
      } else return res.status(400).json({ error: "Department not found" });
      res.send("Ok");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
