const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const GitHubStrategy = require("passport-github2");

//Create Local strategy
//Register
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);

          //Create a new user
          let newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role,
          };

          //Save in DB
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  //Login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("User does not exist");
            return done(null, false);
          }
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Method serielize and deserialize User

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  // GitHub Strategy

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.57fd947064898289",
        clientSecret: "52693041f97f9a7cee6c1089c3b75d7f45c10548",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("User profile", profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          const fullName = profile._json.name;
          const nameParts = fullName.trim().split(/\s+/);
          const firstName = nameParts[0];
          let lastName = nameParts[1];

          if (!user) {
            let newUser = {
              first_name: firstName,
              last_name: lastName,
              age: 38,
              email: profile._json.email,
              password: "",
              role: profile._json.type.toLowerCase(),
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
