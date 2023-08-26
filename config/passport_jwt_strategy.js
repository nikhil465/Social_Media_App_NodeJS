const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const env = require("../config/environment");

const User = require("../models/user");

let options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

passport.use(
  new JWTStrategy(options, function (jwtPayload, done) {
    User.findById(jwtPayload._id)
      .catch((err) => {
        console.log("Error in finding user from JWT");
        return;
      })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
  })
);

module.exports = passport;
