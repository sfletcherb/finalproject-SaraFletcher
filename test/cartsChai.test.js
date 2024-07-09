const mongoose = require("mongoose");
const configObject = require("../src/config/dotenv.js");
const cartRepositoryInstance = require("../src/repositories/carts.repository.js");
const chai = require("chai");
const CartModel = require("../src/models/carts.model.js");

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
});
