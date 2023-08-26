const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

//authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      //find user and establish identity
      User.findOne({ email: email })
        .catch((err) => {
          req.flash("error", err);
          return done(err);
        })
        .then((user) => {
          if (!user || user.password != password) {
            req.flash("error", "Invalid username/password");
            return done(null, false);
          }

          return done(null, user);
        });
    }
  )
);

//serializing the user to decide which key is to be kept the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializeing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .catch((err) => {
      console.log("Error in finding user -> Passport");
      return done(err);
    })
    .then((user) => {
      return done(null, user);
    });
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  //if the user is not signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in usser from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
