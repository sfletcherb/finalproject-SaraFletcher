const assert = require("assert");
const mongoose = require("mongoose");
const configObject = require("../src/config/dotenv.js");
const userRepositoryInstance = require("../src/repositories/user.repository.js");
const UserModel = require("../src/models/user.model.js");
const { createHash } = require("../src/utils/hashbcrypt.js");

const { mongo_url } = configObject;

describe("Testing repository of user", function () {
  this.timeout(20000);

  before(async function () {
    await mongoose.connect(mongo_url);
    this.productsInstance = userRepositoryInstance;
  });

  beforeEach(async function () {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    this.uniqueEmail = uniqueEmail;

    await UserModel.create({
      first_name: "test",
      last_name: "test2",
      email: uniqueEmail,
      password: createHash("password123"),
      age: 19,
      role: "admin",
    });
  });

  after(async function () {
    await mongoose.disconnect();
  });

  /* this.beforeEach(async function () {
    await mongoose.connection.collections.products.drop();
  }) */

  it("should return the user if email and password are valid", async function () {
    const email = this.uniqueEmail;
    const password = "password123";

    const result = await this.productsInstance.userLogin(email, password);

    assert.deepStrictEqual(result.email, email);
  });

  it("should return the _id if the user is create in DB", async function () {
    const email = this.uniqueEmail;
    const password = "password123";

    const result = await this.productsInstance.userLogin(email, password);

    assert.ok(result._id);
  });

  it("should throw an error if the email does not exist", async function () {
    const email = "nonexistent@example.com";
    const password = "password123";

    try {
      await this.productsInstance.userLogin(email, password);
      assert.fail("Expected error not thrown");
    } catch (error) {
      assert.strictEqual(error.message, "The email does not exist");
    }
  });
});
0;
