const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const calculateRating = product => {
  if (product.reviews.length === 0) {
    return 0;
  }

  let rating = 0;
  for (let i = 0; i < product.reviews.length; i++) {
    rating += product.reviews[i].rating;
  }

  rating /= product.reviews.length;
  rating = Number(rating.toFixed(1));
  return rating;
};

router.post("/create", async (req, res) => {
  const rating = req.body.rating;
  const comment = req.body.comment;
  const username = req.body.username;
  const productId = req.body.product;

  try {
    // On recupere le produit grace a l'id
    const product = await Product.findById(productId).populate("reviews");
    if (product) {
      // On check si il y a deja des reviews, si non on initialise reviews
      if (product.reviews === undefined) {
        product.reviews = [];
      }

      // On cree notre review
      const review = new Review({
        rating: rating,
        comment: comment,
        username: username
      });
      await review.save();

      // On ajoute notre review a notre produit
      product.reviews.push(review);

      const rate = calculateRating(product);
      product.averageRating = rate;

      // On sauvegarde notre produit
      await product.save();
      res.status(201).send("Review created");
    } else {
      res.status(400).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const reviewId = req.query.id;
    if (reviewId) {
    } else {
      res.status(400).json({ error: "Wrong parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
