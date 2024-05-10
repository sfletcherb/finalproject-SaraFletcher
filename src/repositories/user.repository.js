const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

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
}

const userRepositoryInstance = new UserRepository();
module.exports = userRepositoryInstance;
