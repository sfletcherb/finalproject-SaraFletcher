const userRepositoryInstance = require("../repositories/user.repository.js");
const createUsersListDTO = require("../dto/user.dto.js");
const generateToken = require("../utils/jsonwebtoken.js");
const UserModel = require("../models/user.model.js");
const generateRandomToken = require("../utils/cryptotoken.js");
const emailControllerInstance = require("../controllers/emailManager.js");
const { isValidPassword, createHash } = require("../utils/hashbcrypt.js");
const mongoose = require("mongoose");

class UserController {
  async userRegister(req, res) {
    let userData = req.body;

    try {
      const newUserRegister = await userRepositoryInstance.userRegister(
        userData
      );

      // Create token
      const token = generateToken({ id: newUserRegister._id });

      res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

      res.redirect("/login-register");
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async userLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userRepositoryInstance.userLogin(email, password);

      await UserModel.updateOne(
        { _id: user._id },
        { $set: { last_connection: Date.now() } }
      );

      const token = generateToken({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        rol: user.role,
        id: user._id,
      });

      res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

      res.redirect("/products");
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find();
      const usersListDTO = createUsersListDTO(users);
      res.json(usersListDTO);
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error retrieving users" });
    }
  }

  async logout(req, res) {
    const user = req.user;

    await UserModel.updateOne(
      { _id: user._id },
      { $set: { last_connection: Date.now() } }
    );
    res.clearCookie("ecommerceCookie");
    res.redirect("/login-register");
  }

  async resetPasswordRequest(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const token = await generateRandomToken(6);

      user.cryptoToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000), // lasts 1 hour
      };

      await user.save();

      await emailControllerInstance.sendResetEmail(
        email,
        user.first_name,
        token
      );

      res.send("The email has been sent successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server internal error");
    }
  }

  async password(req, res) {
    const token = req.body.token;
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const cryptoToken = user.cryptoToken;

      if (!cryptoToken || cryptoToken.token !== token) {
        return res.render("reset-password", {
          error: "password reset token is invalid",
        });
      }

      const now = new Date();
      if (now > cryptoToken.expiresAt) {
        return res.render("reset-password", {
          error: "password reset token expired",
        });
      }

      if (isValidPassword(password, user)) {
        return res.render("password", {
          token,
          error: "the password cannot be the same as the old",
        });
      }

      user.password = createHash(password);

      user.cryptoToken = undefined;
      await user.save();

      res.render("success", {
        layout: "main",
        title: "Password Reset Success",
        message: "The password has been updated successfully.",
        redirectUrl: "/login-register",
      });
    } catch (error) {
      return res
        .status(500)
        .render("passwordreset", { error: "Internal error server" });
    }
  }

  async changeRole(req, res) {
    const { newRole } = req.body;
    const uid = req.params.uid;

    try {
      await userRepositoryInstance.changeRole(uid, newRole);
      res.render("success", {
        layout: "main",
        title: "Role Change Success",
        message: "The role has been changed successfully.",
        redirectUrl: "/login-register",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server internal error");
    }
  }

  async upload(req, res) {
    const fileType = req.body.fileType;
    const files = req.files;
    const uid = req.params.uid;
    console.log("Tipo de archivo seleccionado:", fileType);

    try {
      if (!files || Object.keys(files).length === 0) {
        return res.status(400).send("No file uploaded");
      }

      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const documentsToAdd = [];
      files.forEach((file) => {
        documentsToAdd.push({
          name: file.originalname,
          reference: file.path,
        });
      });

      user.documents.push(...documentsToAdd);
      await user.save();

      res.send({ status: "success", message: "file uploaded successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server internal error");
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de usuario no válido" });
    }
    try {
      const existUserId = await UserModel.findById(userId);
      if (!existUserId) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      await userRepositoryInstance.deleteUser(userId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server internal error" });
    }
  }
}

const userControllerInstance = new UserController();
module.exports = userControllerInstance;
