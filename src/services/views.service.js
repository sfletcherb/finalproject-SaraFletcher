const ProductModel = require("../models/products.model.js");

class ViewsService {
  async dataView() {
    try {
      const data = await ProductModel.find();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

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

const viewsServiceInstance = new ViewsService();
module.exports = viewsServiceInstance;
