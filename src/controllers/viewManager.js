const viewsRepositoryInstance = require("../repositories/views.repository.js");
const userRepositoryInstance = require("../repositories/user.repository.js");
const userControllerInstance = require("./userManager.js");
const cartRepositoryInstance = require("../repositories/carts.repository.js");

class ViewsController {
  async realTimeProducts(req, res) {
    const user = req.user.role;
    console.log("viewcontroller", user);
    res.render("realtimeproducts", { user });
  }

  async chat(req, res) {
    res.render("chat");
  }

  async products(req, res) {
    let query = {};
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || "asc";

    try {
      if (req.query.category) {
        query.category = req.query.category;
      }

      if (req.query.stockIn) {
        query.stock = { $gt: 1 };
      }

      if (req.query.stockOut) {
        query.stock = { $eq: 0 };
      }

      const sortQuery = {};
      if (sort === "asc" || sort === "desc") {
        sortQuery.price = sort === "asc" ? 1 : -1;
      } else {
        sortQuery.price = 1;
      }

      const productList = await viewsRepositoryInstance.products(
        query,
        limit,
        page,
        sortQuery
      );

      const finalResultProductList = productList.docs.map((item) => {
        const { _id, ...rest } = item.toObject();
        return { _id, ...rest };
      });

      const user = { ...req.user };

      res.render("products", {
        status: finalResultProductList || productList ? "success" : "error",
        payload: finalResultProductList,
        totalPages: productList.totalPages,
        prevPage: productList.prevPage,
        nextPage: productList.nextPage,
        page: productList.page,
        hasPrevPage: productList.hasPrevPage,
        hasNextPage: productList.hasNextPage,
        queryString: req.originalUrl.split("?")[1],
        prevLink: productList.hasPrevPage
          ? `/products?page=${productList.prevPage}&limit=${limit}&${
              req.originalUrl.split("?")[1]
            }`
          : null,
        nextLink: productList.hasNextPage
          ? `/products?page=${productList.nextPage}&limit=${limit}&${
              req.originalUrl.split("?")[1]
            }`
          : null,
        user: user,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: `Error: ${error.message}. error loading products`,
      });
    }
  }

  async login(req, res) {
    res.render("login-register", { layout: "main" });
  }

  async resetPassword(req, res) {
    res.render("reset-password");
  }

  async password(req, res) {
    const token = req.params.token;
    res.render("password", { token });
  }

  async changeRole(req, res) {
    const uid = req.params.uid;
    res.render("changeRole", { uid });
  }

  async success(req, res) {
    res.render("success");
  }

  async upload(req, res) {
    const uid = req.params.uid;
    res.render("upload", { uid });
  }

  async getUsers(req, res) {
    try {
      const usersData = await userRepositoryInstance.getUsers();

      const newArray = usersData.map((user) => {
        return {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          last_connection: user.last_connection,
        };
      });
      res.render("users", { usersData: newArray });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: `Error: ${error.message}. error loading users`,
      });
    }
  }

  async showCart(req, res) {
    try {
      const user = req.user.cart;

      const cartById = await cartRepositoryInstance.getCartById(user);

      if (!cartById) {
        throw new Error("Cart not found");
      }

      const newArray = cartById.map((cart) => {
        return {
          id: cart.product._id,
          title: cart.product.title,
          price: cart.product.price,
          quantity: cart.quantity,
        };
      });

      const total = newArray.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      res.render("cart", { cartById: newArray, total: total.toFixed(2) });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: `Error: ${error.message}. error loading cart`,
      });
    }
  }
}

const viewsControllerInstance = new ViewsController();
module.exports = viewsControllerInstance;
