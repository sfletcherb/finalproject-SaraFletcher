const ProductModel = require("../models/products.model.js");

class ViewsRepository {
  async products(query, limit, page, sortQuery) {
    try {
      const productList = await ProductModel.paginate(query, {
        limit: limit,
        page: page,
        sort: sortQuery,
      });
      return productList;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const viewsRepositoryInstance = new ViewsRepository();
module.exports = viewsRepositoryInstance;
