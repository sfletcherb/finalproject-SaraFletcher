const mongoose = require("mongoose");
const configObject = require("./config/dotenv.js");
const cron = require("node-cron");
const userRepositoryInstance = require("./repositories/user.repository.js");

const { mongo_url } = configObject;

// Applicating design pattern Singleton

class DataBase {
  static #instance;

  static async connect() {
    try {
      await mongoose.connect(mongo_url);
      console.log("Connected to MongoDB");
      cron.schedule("0 0 * * *", async () => {
        try {
          await userRepositoryInstance.cleanUpInactiveUsers();
        } catch (error) {
          console.error("Error in user cleanup cron job:", error.message);
        }
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    }
  }
  static async getInstance() {
    if (!this.#instance) {
      await this.connect();
      this.#instance = new DataBase();
      console.log("New DB connection established");
    } else {
      console.log("Previous DB connection found");
    }
    return this.#instance;
  }
}

module.exports = DataBase.getInstance();
