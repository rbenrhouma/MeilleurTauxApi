const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");

const createFilters = req => {
  const filters = {};

  if (req.query.priceMin) {
    filters.price = {};
    // $gte signifi qu'on va recuperer que les produits avec un "price" >= req.query.priceMin
    filters.price.$gte = req.query.priceMin;
  }
  if (req.query.priceMax) {
    // Condition pour pas RE-creer l'objet filters.price
    if (filters.price === undefined) filters.price = {};
    // $lte signifi qu'on va recuperer que les produits avec un "price" <= req.query.priceMax
    filters.price.$lte = req.query.priceMax;
  }
  if (req.query.category) filters.category = req.query.category;
  if (req.query.title) {
    // Ici on crée une regular expression avec l'option "i" qui signifie insensitive
    filters.title = new RegExp(req.query.title, "i");
  }
  return filters;
};

router.get("/", async (req, res) => {
  try {
    const filters = createFilters(req); // On genere les filtres avec ce qu'il y a dans la query

    // On lance une recherche avec les potentiels filtres sur les produits
    const search = Product.find(filters)
      .populate("category")
      .populate("reviews");

    if (req.query.sort === "rating-asc") {
      // ici on ajoute a notre recherche un tri
      search.sort({ averageRating: 1 });
    } else if (req.query.sort === "rating-desc") {
      // ici on ajoute a notre recherche un tri
      search.sort({ averageRating: -1 });
    } else if (req.query.sort === "price-asc") {
      // ici on ajoute a notre recherche un tri
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      // ici on ajoute a notre recherche un tri
      search.sort({ price: -1 });
    }

    if (req.query.page) {
      const page = req.query.page;
      const limit = 2;
      search.limit(limit).skip(limit * page);
    }
    // ici attend la fin de la recherche et on range tout dans products
    const products = await search;
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const categoryId = req.body.category;

  try {
    // On cree une categorie en remplissant le model
    const product = new Product({
      title: title,
      description: description,
      price: price,
      category: categoryId
    });
    // On le sauvegarde pour le mettre dans le base de donnée
    await product.save();
    res.status(201).send("Product created");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  const productId = req.query.id;
  const newTitle = req.body.title;
  const newDescription = req.body.description;
  const newPrice = req.body.price;
  const newCategoryId = req.body.category;

  try {
    // On cree une categorie en remplissant le model
    const product = await Product.findById(productId);

    if (!product) return res.status(400).json({ error: "Product not found" });

    if (newTitle) product.title = newTitle;
    if (newDescription) product.description = newDescription;
    if (newPrice) product.price = newPrice;
    if (newCategoryId) {
      const category = await Category.findById(newCategoryId);
      product.category = category;
    }

    // On le sauvegarde pour le mettre dans le base de donnée
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const productId = req.query.id;
    if (productId) {
      const product = await Product.findById(productId); // Ici on recupere un product qui a comme id : req.body.id

      if (product) await product.remove();
      else return res.status(400).json({ error: "Product not found" });

      res.send("Product deleted");
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
