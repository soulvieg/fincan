// backend/controllers/categoryController.js
const Category = require("../models/Category");

async function getCategoriesController(req, res) {
  try {
    const cats = await Category.findAll({ attributes: ["category_id", "name"] });
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getCategoriesController };