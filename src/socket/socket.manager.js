const socket = require("socket.io");
const MessageModel = require("../models/message.model.js");
const productRepositoryInstance = require("../repositories/products.repository.js");

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("A client has connected");

      // Handle "greeting" event
      socket.on("greeting", (data) => {
        console.log(data);
      });

      // Handle "message" event
      socket.on("message", async (data) => {
        await this.handleMessageEvent(data);
      });

      // Handle "addProduct" event
      socket.on("addProduct", async (data) => {
        await this.handleAddProductEvent(data);
      });

      // Handle "deleteProduct" event
      socket.on("deleteProduct", async (productId) => {
        await this.handleDeleteProductEvent(productId);
      });

      // Emit initial product list on connection
      this.emitInitialProductList(socket);
    });
  }

  async handleMessageEvent(data) {
    try {
      await MessageModel.create(data);
      const messages = await MessageModel.find();
      this.io.sockets.emit("message", messages);
    } catch (error) {
      console.log("Error handling message event:", error);
    }
  }

  async handleAddProductEvent(data) {
    try {
      await productRepositoryInstance.addProduct(data);
      const productList = await productRepositoryInstance.getAllProducts();
      this.io.sockets.emit("updateProductList", productList);
      console.log("Product added successfully");
    } catch (error) {
      console.log("Error handling addProduct event:", error);
    }
  }

  async handleDeleteProductEvent(productId) {
    try {
      await productRepositoryInstance.deleteProduct(productId);
      const productList = await productRepositoryInstance.getAllProducts();
      this.io.sockets.emit("updateProductList", productList);
      console.log("Product deleted successfully");
    } catch (error) {
      console.log("Error handling deleteProduct event:", error);
    }
  }

  async emitInitialProductList(socket) {
    try {
      const productList = await productRepositoryInstance.getAllProducts();
      socket.emit("updateProductList", productList);
    } catch (error) {
      console.log("Error emitting initial product list:", error);
    }
  }
}

module.exports = SocketManager;
