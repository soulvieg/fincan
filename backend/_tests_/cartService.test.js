""; // __tests__/cartService.test.js
const {
  addProductToCart,
  getCart,
  mergeGuestCartIntoUser,
} = require("../services/cartService");
const CartItem = require("../models/cartItem");
const Product = require("../models/Product");

jest.mock("../models/cartItem");
jest.mock("../models/Product");

describe("cartService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("addProductToCart", () => {
    test("throws error if neither customer_id nor session_id provided", async () => {
      await expect(
        addProductToCart({ product_id: 1, quantity: 2 })
      ).rejects.toThrow("Either customer_id or session_id is required.");
    });

    test("throws error if product not found", async () => {
      Product.findByPk.mockResolvedValue(null);

      await expect(
        addProductToCart({ product_id: 1, quantity: 2, customer_id: 3 })
      ).rejects.toThrow("Product not found.");
    });

    test("throws error if product is out of stock", async () => {
      Product.findByPk.mockResolvedValue({ stock: 0 });

      await expect(
        addProductToCart({ product_id: 1, quantity: 2, customer_id: 3 })
      ).rejects.toThrow("This product is out of stock.");
    });

    test("throws error if requested quantity exceeds stock", async () => {
      Product.findByPk.mockResolvedValue({ stock: 5 });
      CartItem.findOne.mockResolvedValue({ quantity: 4 });

      await expect(
        addProductToCart({ product_id: 1, quantity: 2, customer_id: 3 })
      ).rejects.toThrow("Cannot add 2 item(s). Only 1 left in stock.");
    });

    test("updates quantity if item already in cart", async () => {
      const saveMock = jest.fn();
      Product.findByPk.mockResolvedValue({ stock: 10 });
      CartItem.findOne.mockResolvedValue({ quantity: 2, save: saveMock });

      const result = await addProductToCart({
        product_id: 1,
        quantity: 3,
        customer_id: 3,
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result.quantity).toBe(5);
    });

    test("creates new cart item if not already in cart", async () => {
      Product.findByPk.mockResolvedValue({ stock: 10 });
      CartItem.findOne.mockResolvedValue(null);
      CartItem.create.mockResolvedValue({ id: 1 });

      const result = await addProductToCart({
        product_id: 1,
        quantity: 2,
        customer_id: 3,
      });

      expect(CartItem.create).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });
  });

  describe("getCart", () => {
    test("throws error if neither customer_id nor session_id provided", async () => {
      await expect(getCart({})).rejects.toThrow(
        "Either customer_id or session_id is required."
      );
    });

    test("returns cart items based on customer_id", async () => {
      CartItem.findAll.mockResolvedValue([{ id: 1 }]);

      const result = await getCart({ customer_id: 3 });
      expect(result).toEqual([{ id: 1 }]);
      expect(CartItem.findAll).toHaveBeenCalled();
    });
  });

  describe("mergeGuestCartIntoUser", () => {
    test("skips merge if session_id or customer_id is missing", async () => {
      await expect(mergeGuestCartIntoUser(null, null)).resolves.toBeUndefined();
    });

    test("merges guest items into user cart", async () => {
      const destroyMock = jest.fn();
      const saveMock = jest.fn();
      CartItem.findAll.mockResolvedValue([
        { product_id: 1, quantity: 2, destroy: destroyMock, save: saveMock },
      ]);
      CartItem.findOne.mockResolvedValue({ quantity: 1, save: saveMock });

      await mergeGuestCartIntoUser("session123", 7);

      expect(CartItem.findAll).toHaveBeenCalled();
      expect(CartItem.findOne).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(destroyMock).toHaveBeenCalled();
    });
  });
});
