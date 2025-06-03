const httpMocks = require("node-mocks-http");
const productService = require("../services/productService");
const commentService = require("../services/commentService");
const {
  addProductController,
  updateQuantityInStockController,
  deleteProductController,
  incrementStockController,
  decrementStockController,
  searchProductsController,
  getProductsController,
  updateImageController,
  addCategoryController,
  updatePriceController,
  updateProductDiscountController,
  getProductDiscountController,
  approveCommentController,
  rejectCommentController,
} = require("../controllers/productController");

jest.mock("../services/productService");
jest.mock("../services/commentService");

describe("Product Controller Tests", () => {
  afterEach(() => jest.clearAllMocks());

  test("addProductController - success", async () => {
    const req = httpMocks.createRequest({ body: { name: "Test Product" } });
    const res = httpMocks.createResponse();
    productService.addProduct.mockResolvedValue({ id: 1 });

    await addProductController(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ id: 1 });
  });

  test("updateQuantityInStockController - invalid quantity", async () => {
    const req = httpMocks.createRequest({
      params: { productId: "1" },
      body: { newQuantity: -5 },
    });
    const res = httpMocks.createResponse();

    await updateQuantityInStockController(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("deleteProductController - not found", async () => {
    const req = httpMocks.createRequest({ params: { productId: "10" } });
    const res = httpMocks.createResponse();
    productService.deleteProduct.mockRejectedValue(
      new Error("Product not found")
    );

    await deleteProductController(req, res);
    expect(res.statusCode).toBe(404);
  });

  test("incrementStockController - success", async () => {
    const req = httpMocks.createRequest({ params: { productId: "1" } });
    const res = httpMocks.createResponse();
    productService.incrementStock.mockResolvedValue({ quantity_in_stock: 11 });

    await incrementStockController(req, res);
    expect(res.statusCode).toBe(200);
  });

  test("decrementStockController - stock already zero", async () => {
    const req = httpMocks.createRequest({ params: { productId: "1" } });
    const res = httpMocks.createResponse();
    productService.decrementStock.mockRejectedValue(
      new Error("Stock already at zero")
    );

    await decrementStockController(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("searchProductsController - no query", async () => {
    const req = httpMocks.createRequest({ query: {} });
    const res = httpMocks.createResponse();

    await searchProductsController(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("getProductsController - fetch success", async () => {
    const req = httpMocks.createRequest({ query: {} });
    const res = httpMocks.createResponse();
    productService.getProducts.mockResolvedValue([{ name: "Product A" }]);

    await getProductsController(req, res);
    expect(res.statusCode).toBe(200);
  });

  test("updateImageController - invalid image url", async () => {
    const req = httpMocks.createRequest({
      params: { productId: "1" },
      body: { image_url: "" },
    });
    const res = httpMocks.createResponse();

    await updateImageController(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("addCategoryController - duplicate", async () => {
    const req = httpMocks.createRequest({ body: { name: "Electronics" } });
    const res = httpMocks.createResponse();
    productService.addCategory.mockRejectedValue(
      new Error("Category already exists")
    );

    await addCategoryController(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("updatePriceController - invalid price", async () => {
    const req = httpMocks.createRequest({
      params: { productId: "1" },
      body: { price: -100 },
    });
    const res = httpMocks.createResponse();

    await updatePriceController(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("updateProductDiscountController - success", async () => {
    const req = httpMocks.createRequest({
      params: { productId: "1" },
      body: { discount: 0.2 },
    });
    const res = httpMocks.createResponse();
    productService.updateProductDiscount.mockResolvedValue({
      product_id: 1,
      discount: 0.2,
    });

    await updateProductDiscountController(req, res);
    expect(res.statusCode).toBe(200);
  });

  test("getProductDiscountController - product not found", async () => {
    const req = httpMocks.createRequest({ params: { productId: "99" } });
    const res = httpMocks.createResponse();
    productService.fetchProductDiscount.mockRejectedValue(
      new Error("Product not found.")
    );

    await getProductDiscountController(req, res);
    expect(res.statusCode).toBe(404);
  });

  test("approveCommentController - success", async () => {
    const req = httpMocks.createRequest({ params: { commentId: "1" } });
    const res = httpMocks.createResponse();
    commentService.approveComment.mockResolvedValue({ comment_id: 1 });

    await approveCommentController(req, res);
    expect(res.statusCode).toBe(200);
  });

  test("rejectCommentController - failure", async () => {
    const req = httpMocks.createRequest({ params: { commentId: "1" } });
    const res = httpMocks.createResponse();
    commentService.rejectComment.mockRejectedValue(new Error("Reject failed"));

    await rejectCommentController(req, res);
    expect(res.statusCode).toBe(400);
  });
});
