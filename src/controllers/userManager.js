const userRepositoryInstance = require("../repositories/user.repository.js");
const UserDTO = require("../dto/user.dto.js");
const generateToken = require("../utils/jsonwebtoken.js");
const UserModel = require("../models/user.model.js");
const generateRandomToken = require("../utils/cryptotoken.js");
const emailControllerInstance = require("../controllers/emailManager.js");
const { isValidPassword, createHash } = require("../utils/hashbcrypt.js");

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

      res.redirect("/login");
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async userLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userRepositoryInstance.userLogin(email, password);
      const token = generateToken({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        rol: user.role,
        id: user._id,
      });

      res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

      res.redirect("/api/sessions/current");
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async current(req, res) {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "There is not user authenticated" });
    }

    const userData = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role,
      req.user.cart
    );

    res.status(200).json(userData);
  }

  async logout(req, res) {
    res.clearCookie("ecommerceCookie");
    res.redirect("/login");
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

      return res.redirect("/login");
    } catch (error) {
      return res
        .status(500)
        .render("passwordreset", { error: "Internal error server" });
    }
  }
}

const userControllerInstance = new UserController();
module.exports = userControllerInstance;
