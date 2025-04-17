const wishlistService = require("../services/wishlistService");

async function addToWishlist(req, res) {
  const { customerId, productId } = req.body;
  try {
    const item = await wishlistService.addItemToWishlist(customerId, productId);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function removeFromWishlist(req, res) {
  const { customerId, productId } = req.body;
  try {
    await wishlistService.removeItemFromWishlist(customerId, productId);
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getWishlist(req, res) {
  const customerId = req.params.customerId;
  try {
    const items = await wishlistService.getUserWishlist(customerId);
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};

