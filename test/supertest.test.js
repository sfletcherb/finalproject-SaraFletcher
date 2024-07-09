const supertest = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Testing ecommerce", () => {
  describe("Testing products API", () => {
    it("Endoint POST /api/products should create a new Product", async () => {
      const productData = {
        title: "Product 2",
        description: "Description 1",
        price: 100,
        img: "sin imagen",
        code: "lkj78",
        stock: 10,
        category: "Category 1",
        status: true,
        thumbnail: [],
        owner: "admin",
      };

      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(productData);
      console.log(statusCode);
      console.log(ok);
      console.log(_body);

      expect(statusCode).to.equal(200);
      expect(ok).to.be.true;
      expect(_body).to.have.property("message", "Product added successfully");
    });

    it("Endpoint GET /api/products should get all Products", async () => {
      const response = await requester.get("/api/products");

      const { statusCode, ok, _body } = response;

      expect(statusCode).to.equal(200, "Expected status code 200");
      expect(ok).to.be.true;
      expect(_body).to.be.an("array");
      expect(_body.length).to.be.greaterThan(
        0,
        "Expected non-empty array of products"
      );
    });

    it("Endpoint GET /api/products/:pid should get a Product by ID", async () => {
      const knownProductId = "6646108f07185246e82f592e";
      const response = await requester.get(`/api/products/${knownProductId}`);

      const { statusCode, ok, _body } = response;

      expect(statusCode).to.equal(200, "Expected status code 200");
      expect(ok).to.be.true;
      expect(_body).to.have.property("_id", knownProductId);
    });
  });
});
