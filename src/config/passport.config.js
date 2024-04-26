const passport = require("passport");
const jwt = require("passport-jwt");
const UserModel = require("../models/user.model.js");

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "palabrasecretaparatoken",
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id);
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

// Create cookie extractor
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["ecommerceCookie"];
  }
  return token;
};

module.exports = initializePassport;
