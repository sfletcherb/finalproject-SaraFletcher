const userRepositoryInstance = require("../repositories/user.repository.js");
const UserDTO = require("../dto/user.dto.js");
const generateToken = require("../utils/jsonwebtoken.js");

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
}

const userControllerInstance = new UserController();
module.exports = userControllerInstance;
