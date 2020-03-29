const express = require("express");
const router = express.Router();

// Recuperer le model Category
const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    // On recupere toute les categories
    const categories = await Category.find().populate("department");

    res.json(`{html= <a href="../">Retour><a>}` + categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const departmentId = req.body.department;

  try {
    // On cree une categorie en remplissant le model
    const category = new Category({
      title: title,
      description: description,
      department: departmentId
    });
    // On le sauvegarde pour le mettre dans le base de donnée
    await category.save();
    res.status(201).send("Category created");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  const categoryId = req.query.id;
  const newTitle = req.body.title;
  const newDescription = req.body.description;
  const newDepartmentId = req.body.department;

  try {
    // On cree une categorie en remplissant le model
    const category = await Category.findById(categoryId);

    if (!category) return res.status(400).json({ error: "Category not found" });

    if (newTitle) category.title = newTitle;
    if (newDescription) category.description = newDescription;
    if (newDepartmentId) {
      const department = await Department.findById(newDepartmentId);
      category.department = department;
    }

    // On le sauvegarde pour le mettre dans le base de donnée
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const categoryId = req.query.id;
    if (categoryId) {
      const category = await Category.findById(categoryId); // Ici on recupere une categorie qui a comme id : req.body.id

      if (category) {
        // On supprime tous les produits associés a cette categorie
        await Product.deleteMany({ category: categoryId });

        // On recupere tous les produits associés a cette categorie
        //  const productsToRemove = await Product.find({ category: categoryId });
        //  for (let i = 0; i < productsToRemove.length; i++) {
        //    // on les supprime tous. EXTERMINATION
        //    await productsToRemove[i].remove();
        //  }

        // On supprime a la fin la categorie
        await category.remove();
      } else return res.status(400).json({ error: "Category not found" });

      res.send("Category deleted");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
