// __tests__/reviewService.test.js
const reviewService = require("../services/reviewService");
const Rating = require("../models/Rating");
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const User = require("../models/User");
const orderService = require("../services/orderService");

jest.mock("../models/Rating");
jest.mock("../models/Comment");
jest.mock("../models/Product");
jest.mock("../models/User");
jest.mock("../services/orderService");

describe("Review Service", () => {
  afterEach(() => jest.clearAllMocks());

  describe("addCommentToProduct", () => {
    it("should throw error if product not found", async () => {
      Product.findByPk.mockResolvedValue(null);
      await expect(
        reviewService.addCommentToProduct(1, 1, "Nice!")
      ).rejects.toThrow("Product not found");
    });

    it("should throw error if user didn't purchase", async () => {
      Product.findByPk.mockResolvedValue({});
      orderService.hasUserPurchasedProduct.mockResolvedValue(false);
      await expect(
        reviewService.addCommentToProduct(1, 1, "Nice!")
      ).rejects.toThrow("User has not purchased this product");
    });

    it("should create comment if purchased", async () => {
      Product.findByPk.mockResolvedValue({});
      orderService.hasUserPurchasedProduct.mockResolvedValue(true);
      const mockComment = { id: 1, text: "Nice!" };
      Comment.create.mockResolvedValue(mockComment);
      const result = await reviewService.addCommentToProduct(1, 1, "Nice!");
      expect(result).toBe(mockComment);
    });
  });

  describe("addRatingToProduct", () => {
    it("should throw error if product not found", async () => {
      Product.findByPk.mockResolvedValue(null);
      await expect(reviewService.addRatingToProduct(1, 1, 4)).rejects.toThrow(
        "Product not found"
      );
    });

    it("should throw error if rating is out of range", async () => {
      Product.findByPk.mockResolvedValue({});
      orderService.hasUserPurchasedProduct.mockResolvedValue(true);
      await expect(reviewService.addRatingToProduct(1, 1, 6)).rejects.toThrow(
        "Rating must be between 1 and 5"
      );
    });

    it("should create a new rating if not exists", async () => {
      Product.findByPk.mockResolvedValue({});
      orderService.hasUserPurchasedProduct.mockResolvedValue(true);
      Rating.findOne.mockResolvedValue(null);
      const mockRating = { id: 1, score: 4 };
      Rating.create.mockResolvedValue(mockRating);
      const result = await reviewService.addRatingToProduct(1, 1, 4);
      expect(result).toBe(mockRating);
    });

    it("should update an existing rating", async () => {
      Product.findByPk.mockResolvedValue({});
      orderService.hasUserPurchasedProduct.mockResolvedValue(true);
      const mockRating = { score: 2, save: jest.fn() };
      Rating.findOne.mockResolvedValue(mockRating);
      const result = await reviewService.addRatingToProduct(1, 1, 5);
      expect(mockRating.save).toHaveBeenCalled();
      expect(result.score).toBe(5);
    });
  });

  describe("reviewComment", () => {
    it("should throw if comment not found", async () => {
      Comment.findByPk.mockResolvedValue(null);
      await expect(reviewService.reviewComment(1, 2, true)).rejects.toThrow(
        "Comment not found"
      );
    });

    it("should update and return comment", async () => {
      const comment = { approval: null, manager_id: null, save: jest.fn() };
      Comment.findByPk.mockResolvedValue(comment);
      const result = await reviewService.reviewComment(1, 2, true);
      expect(result.approval).toBe(true);
      expect(result.manager_id).toBe(2);
    });
  });

  describe("getApprovedCommentsForProduct", () => {
    it("should fetch approved comments", async () => {
      const mockComments = [{ id: 1 }, { id: 2 }];
      Comment.findAll.mockResolvedValue(mockComments);
      const result = await reviewService.getApprovedCommentsForProduct(5);
      expect(result).toBe(mockComments);
    });
  });

  describe("getPendingComments", () => {
    it("should return pending comments", async () => {
      const mockPending = [{ id: 1 }];
      Comment.findAll.mockResolvedValue(mockPending);
      const result = await reviewService.getPendingComments();
      expect(result).toEqual(mockPending);
    });
  });

  describe("getRatingForCustomerComments", () => {
    it("should return ratings", async () => {
      const mockRatings = [{ score: 4 }];
      Rating.findAll.mockResolvedValue(mockRatings);
      const result = await reviewService.getRatingForCustomerComments(1, 2);
      expect(result).toEqual(mockRatings);
    });
  });
});
