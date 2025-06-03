// reviewController.test.js

const httpMocks = require("node-mocks-http");
const reviewService = require("../services/reviewService");
const {
  addCommentController,
  addRatingController,
  reviewCommentController,
  getApprovedCommentsController,
  getPendingCommentsController,
  getCommentsController,
  getRatingForCustomerCommentsController,
  getPendingCommentsForProductContoller,
} = require("../controllers/reviewController");

jest.mock("../services/reviewService");

describe("reviewController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("addCommentController", () => {
    it("should return 400 if userId or comment is missing", async () => {
      const req = httpMocks.createRequest({
        params: { productId: 1 },
        body: {},
      });
      const res = httpMocks.createResponse();
      await addCommentController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 201 if comment is added successfully", async () => {
      reviewService.addCommentToProduct.mockResolvedValue({
        id: 1,
        text: "Great!",
      });
      const req = httpMocks.createRequest({
        params: { productId: 1 },
        body: { userId: 2, comment: "Great!" },
      });
      const res = httpMocks.createResponse();
      await addCommentController(req, res);
      expect(res.statusCode).toBe(201);
    });
  });

  describe("addRatingController", () => {
    it("should return 400 if customer_id or rating is missing", async () => {
      const req = httpMocks.createRequest({
        params: { productId: 1 },
        body: {},
      });
      const res = httpMocks.createResponse();
      await addRatingController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 201 if rating is added", async () => {
      reviewService.addRatingToProduct.mockResolvedValue({ score: 5 });
      const req = httpMocks.createRequest({
        params: { productId: 1 },
        body: { customer_id: 1, rating: 5 },
      });
      const res = httpMocks.createResponse();
      await addRatingController(req, res);
      expect(res.statusCode).toBe(201);
    });
  });

  describe("reviewCommentController", () => {
    it("should return 400 if inputs are invalid", async () => {
      const req = httpMocks.createRequest({
        params: { commentId: 1 },
        body: {},
      });
      const res = httpMocks.createResponse();
      await reviewCommentController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 200 if comment reviewed", async () => {
      reviewService.reviewComment.mockResolvedValue({ approval: true });
      const req = httpMocks.createRequest({
        params: { commentId: 1 },
        body: { managerId: 10, approve: true },
      });
      const res = httpMocks.createResponse();
      await reviewCommentController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getApprovedCommentsController", () => {
    it("should return 200 with comments", async () => {
      reviewService.getApprovedCommentsForProduct.mockResolvedValue([]);
      const req = httpMocks.createRequest({ params: { productId: 1 } });
      const res = httpMocks.createResponse();
      await getApprovedCommentsController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getPendingCommentsController", () => {
    it("should return 200 with formatted comments", async () => {
      reviewService.getPendingComments.mockResolvedValue([
        {
          comment_id: 1,
          text: "Pending...",
          customer_id: 5,
          Customer: { firstName: "Alice" },
        },
      ]);
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      await getPendingCommentsController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getPendingCommentsForProductContoller", () => {
    it("should return 200 with comments for product", async () => {
      reviewService.getPendingCommentsForProduct.mockResolvedValue([]);
      const req = httpMocks.createRequest({ params: { productId: 2 } });
      const res = httpMocks.createResponse();
      await getPendingCommentsForProductContoller(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getCommentsController", () => {
    it("should return 200 with all comments", async () => {
      reviewService.getComments.mockResolvedValue([]);
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      await getCommentsController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getRatingForCustomerCommentsController", () => {
    it("should return 400 if customerID missing", async () => {
      const req = httpMocks.createRequest({ params: { productID: 1 } });
      const res = httpMocks.createResponse();
      await getRatingForCustomerCommentsController(req, res);
      expect(res.statusCode).toBe(400);
    });

    it("should return 200 with rating", async () => {
      reviewService.getRatingForCustomerComments.mockResolvedValue([
        { score: 4 },
      ]);
      const req = httpMocks.createRequest({
        params: { productID: 1, customerID: 1 },
      });
      const res = httpMocks.createResponse();
      await getRatingForCustomerCommentsController(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
});
