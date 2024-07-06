// native module allow doing validation
const assert = require("assert");
const mongoose = require("mongoose");
const configObject = require("../src/config/dotenv.js");
const productRepositoryInstance = require("../src/repositories/products.repository.js");

const { mongo_url } = configObject;

describe("Testing repository of products", function () {
  this.timeout(20000);

  before(async function () {
    await mongoose.connect(mongo_url);
    this.productsInstance = productRepositoryInstance;
  });

  after(async function () {
    await mongoose.disconnect();
  });

  /* this.beforeEach(async function () {
    await mongoose.connection.collections.products.drop();
  }) */

  it("Get products has to return a list of products", async function () {
    const results = await this.productsInstance.getAllProducts();
    assert.strictEqual(Array.isArray(results), true);
  });

  it("should add a new product successfully", async function () {
    const productData = {
      title: "Product 1",
      description: "Description 1",
      price: 100,
      img: "sin imagen",
      code: "P001",
      stock: 10,
      category: "Category 1",
      status: true,
      thumbnail: [],
      owner: "admin",
    };

    const product = await this.productsInstance.addProduct(productData);
    assert.ok(product._id);
    assert.strictEqual(product.title, productData.title);
    assert.deepStrictEqual(product.thumbnail, []);
  });

  it("should ensure the field is not empty", async function () {
    const productData = {
      title: "Product 2",
      description: "Description 1",
      price: 100,
      img: "sin imagen",
      code: "P005",
      stock: 10,
      category: "Category 1",
      status: true,
      thumbnail: [],
      owner: "admin",
    };

    await this.productsInstance.addProduct(productData);

    assert.ok(
      productData.title.length > 0,
      "Title should not be an empty string"
    );
    assert.ok(
      productData.description.length > 0,
      "Description should not be an empty string"
    );
    assert.ok(productData.price > 0, "Price should be greater than zero");
    assert.ok(
      productData.code.length > 0,
      "Code should not be an empty string"
    );
    assert.ok(productData.stock >= 0, "Stock should be zero or greater");
    assert.ok(
      productData.category.length > 0,
      "Category should not be an empty string"
    );
    assert.ok(
      productData.status !== undefined,
      "Status should not be undefined"
    );
    assert.ok(
      Array.isArray(productData.thumbnail),
      "Thumbnail should be an array"
    );
    assert.ok(
      productData.owner.length > 0,
      "Owner should not be an empty string"
    );
  });
});
