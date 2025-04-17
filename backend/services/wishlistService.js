const Wishlist = require("../models/Wishlist");

async function addItemToWishlist(customerId, productId) {
  return await Wishlist.create({ customerId, productId });
}

async function removeItemFromWishlist(customerId, productId) {
  return await Wishlist.destroy({
    where: { customerId, productId },
  });
}

async function getUserWishlist(customerId) {
  return await Wishlist.findAll({ where: { customerId } });
}

async function getUsersWithProductInWishlist(productId) {
  return await Wishlist.findAll({ where: { productId } });
}

module.exports = {
  addItemToWishlist,
  removeItemFromWishlist,
  getUserWishlist,
  getUsersWithProductInWishlist,
};

