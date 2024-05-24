const { faker } = require("@faker-js/faker");

const mockProductList = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.string.alphanumeric(8),
    stock: faker.number.int(100),
    category: faker.helpers.arrayElement(["beauty", "medicine", "health"]),
    status: faker.datatype.boolean(),
    thumbnail: faker.image.url(),
  };
};

const PRODUCTS = faker.helpers.multiple(mockProductList, { count: 100 });
const PRODUCTS_JSON = JSON.stringify(PRODUCTS);

module.exports = PRODUCTS_JSON;
