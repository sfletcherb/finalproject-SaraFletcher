const mongoose = require("mongoose");
const configObject = require("../src/config/dotenv.js");
const cartRepositoryInstance = require("../src/repositories/carts.repository.js");
const chai = require("chai");

const expect = chai.expect;
const { mongo_url } = configObject;

describe("Testing respository of carts", function () {
  this.timeout(20000);

  before(async function () {
    await mongoose.connect(mongo_url);
    this.cartsInstance = cartRepositoryInstance;
  });

  after(async function () {
    await mongoose.disconnect();
  });

  /* this.beforeEach(async function () {
    await mongoose.connection.collections.products.drop();
  }) */

  it("Get carts has to return a list of carts", async function () {
    const results = await this.cartsInstance.getAllCarts();
    expect(Array.isArray(results)).to.be.true;
  });

  it("should create a cart with an empty products array", async function () {
    const cart = await this.cartsInstance.createCart();

    expect(cart).to.be.an("object");
    expect(cart).to.have.property("_id");
    expect(cart.products).to.be.an("array").that.is.empty;
  });

  it("should return products of the cart by ID", async function () {
    const testCartId = {
      _id: "66466c390d4f1782519f404c",
      products: [
        {
          product: "6646108f07185246e82f5935",
          quantity: 1,
          _id: "664e209382dfee5ce6a0031c",
        },
      ],
    };

    const carts = await this.cartsInstance.getCartById(testCartId._id);

    expect(carts).to.be.an("array");
    expect(carts[0]);
    expect(carts[0]).to.have.property("quantity").that.equals(1);
  });
});
