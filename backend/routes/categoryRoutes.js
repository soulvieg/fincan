// routes/categoryRoutes.js
const express  = require("express");
const Category = require("../models/Category");   // <-- not require("../models")

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cats = await Category.findAll({ attributes: ["category_id","name"] });
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load categories." });
  }
});

module.exports = router;