const httpMocks = require("node-mocks-http");
const {
  addToCartController,
  getCartController,
  mergeCartController,
} = require("../controllers/cartController");

const cartService = require("../services/cartService");

jest.mock("../services/cartService"); // Mock the whole module

describe("Cart Controller Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addToCartController", () => {
    it("should return 400 if product_id or quantity is missing", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { quantity: 2 },
      });
      const res = httpMocks.createResponse();

      await addToCartController(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: "product_id and quantity are required.",
      });
    });

    it("should return 200 and cartItem if addProductToCart succeeds", async () => {
      const fakeItem = { product_id: 1, quantity: 2 };
      cartService.addProductToCart.mockResolvedValue(fakeItem);

      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          customer_id: 1,
          session_id: null,
          product_id: 1,
          quantity: 2,
        },
      });
      const res = httpMocks.createResponse();

      await addToCartController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: "Item added to cart successfully",
        cartItem: fakeItem,
      });
      expect(cartService.addProductToCart).toHaveBeenCalledTimes(1);
    });

    it("should handle errors from service", async () => {
      cartService.addProductToCart.mockRejectedValue(new Error("Mock Error"));

      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          customer_id: 1,
          session_id: null,
          product_id: 1,
          quantity: 2,
        },
      });
      const res = httpMocks.createResponse();

      await addToCartController(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Mock Error" });
    });
  });

  describe("getCartController", () => {
    it("should return 200 and cart items", async () => {
      const fakeCart = [{ product_id: 1, quantity: 2 }];
      cartService.getCart.mockResolvedValue(fakeCart);

      const req = httpMocks.createRequest({
        method: "GET",
        query: { customer_id: 1, session_id: null },
      });
      const res = httpMocks.createResponse();

      await getCartController(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: "Cart retrieved successfully",
        cart: fakeCart,
      });
    });

    it("should return 400 on error", async () => {
      cartService.getCart.mockRejectedValue(new Error("Cart error"));

      const req = httpMocks.createRequest({
        method: "GET",
        query: { customer_id: 1 },
      });
      const res = httpMocks.createResponse();

      await getCartController(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Cart error" });
    });
  });

  describe("mergeCartController", () => {
    it("should return 400 if session_id or customer_id missing", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { session_id: null },
      });
      const res = httpMocks.createResponse();

      await mergeCartController(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: "session_id and customer_id are required.",
      });
    });

    it("should return 200 if merge successful", async () => {
      cartService.mergeGuestCartIntoUser.mockResolvedValue();

      const req = httpMocks.createRequest({
        method: "POST",
        body: { session_id: "abc", customer_id: 1 },
      });
      const res = httpMocks.createResponse();

      await mergeCartController(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: "Cart merged successfully.",
      });
    });

    it("should return 500 on merge error", async () => {
      cartService.mergeGuestCartIntoUser.mockRejectedValue(
        new Error("Merge failed")
      );

      const req = httpMocks.createRequest({
        method: "POST",
        body: { session_id: "abc", customer_id: 1 },
      });
      const res = httpMocks.createResponse();

      await mergeCartController(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Merge failed" });
    });
  });
});
