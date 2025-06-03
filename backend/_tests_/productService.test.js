const productService = require("../services/productService");
const Product = require("../models/Product");
const Rating = require("../models/Rating");
const Category = require("../models/Category");

jest.mock("../models/Product");
jest.mock("../models/Rating");
jest.mock("../models/Category");

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addProduct should create a new product", async () => {
    Product.create.mockResolvedValue({ name: "Phone" });
    const result = await productService.addProduct({ name: "Phone" });
    expect(Product.create).toHaveBeenCalled();
    expect(result.name).toBe("Phone");
  });

  test("getProducts should return products with price and rating as numbers", async () => {
    Product.findAll.mockResolvedValue([
      {
        get: () => ({ price: "100.50", rating: "4.2" }),
      },
    ]);
    const result = await productService.getProducts({});
    expect(result[0].price).toBeCloseTo(100.5);
    expect(result[0].rating).toBeCloseTo(4.2);
  });

  test("updateProductQuantity should throw if product not found", async () => {
    Product.findByPk.mockResolvedValue(null);
    await expect(productService.updateProductQuantity(1, 5)).rejects.toThrow(
      "Product not found"
    );
  });

  test("incrementStock should increment stock", async () => {
    const saveMock = jest.fn();
    Product.findByPk.mockResolvedValue({
      quantity_in_stock: 3,
      save: saveMock,
    });
    await productService.incrementStock(1);
    expect(saveMock).toHaveBeenCalled();
  });

  test("decrementStock should throw when stock is zero", async () => {
    Product.findByPk.mockResolvedValue({ quantity_in_stock: 0 });
    await expect(productService.decrementStock(1)).rejects.toThrow(
      "Stock already at zero"
    );
  });

  test("searchProducts should return matching products", async () => {
    Product.findAll.mockResolvedValue([{ get: () => ({ price: "123.45" }) }]);
    const results = await productService.searchProducts("test");
    expect(results[0].price).toBeCloseTo(123.45);
  });

  test("deleteProduct should return true if product is deleted", async () => {
    Product.destroy.mockResolvedValue(1);
    const result = await productService.deleteProduct(1);
    expect(result).toBe(true);
  });

  test("addCategory should throw if name is missing", async () => {
    await expect(productService.addCategory()).rejects.toThrow(
      "Category name is required"
    );
  });

  test("updateProductDiscount should throw for invalid discount", async () => {
    await expect(productService.updateProductDiscount(1, 2)).rejects.toThrow(
      "Discount must be a number between 0 and 1."
    );
  });

  test("fetchProductDiscount should return a number", async () => {
    Product.findByPk.mockResolvedValue({ discount: "0.25" });
    const discount = await productService.fetchProductDiscount(1);
    expect(discount).toBe(0.25);
  });
});
