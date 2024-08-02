const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const mongoose = require("mongoose");
const emailControllerInstance = require("../controllers/emailManager.js");

class UserRepository {
  async userRegister(data) {
    const { first_name, last_name, email, age, password, role } = data;

    try {
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        throw new Error("The email is already registered");
      }

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role,
      });

      return await newUser.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async userLogin(email, password) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error("The email does not exist");
      }

      if (!isValidPassword(password, user)) {
        throw new Error("The password is invalid");
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async changeRole(uid, role) {
    try {
      const user = await UserModel.findById(uid);
      if (!user) {
        throw new Error("The user does not exist");
      }

      if (
        (user.role === "user" && role === "premium") ||
        (user.role === "premium" && role === "user")
      ) {
        user.role = role;
        await user.save();
      } else {
        throw new Error("Invalid role specified");
      }
    } catch (error) {
      console.error("Error changing role:", error.message);
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(id) {
    const objectId = new mongoose.Types.ObjectId(id);
    try {
      await UserModel.findByIdAndDelete(objectId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async cleanUpInactiveUsers() {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    try {
      const inactiveUsers = await UserModel.find({
        last_connection: { $lt: twoDaysAgo },
      });

      console.log(`Found ${inactiveUsers.length} inactive users.`);

      for (const user of inactiveUsers) {
        console.log(user.email);
        await emailControllerInstance.deleteUserEmail(user.email);
      }
      await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });

      console.log("Inactive users deleted");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const userRepositoryInstance = new UserRepository();
module.exports = userRepositoryInstance;
