const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Friendship = require("../models/friendships");

//render profile page
module.exports.profile = async function (req, res) {
  // User.findById(req.params.id)
  //   .catch((err) => {
  //     console.log("Error finding a profile using id");
  //     return;
  //   })
  //   .then((user) => {
  //     return res.render("user_profile", {
  //       title: "Users",
  //       profile_user: user,
  //     });
  //   });

  try {
    if (!req.params.id) {
      return res.render("user_sign_in", {
        title: "Codial | Sign In",
      });
    }
    let user = await User.findById(req.params.id);
    let friendship1, friendship2;

    friendship1 = await Friendship.findOne({
      from_user: req.user,
      to_user: req.params.id,
    });

    friendship2 = await Friendship.findOne({
      from_user: req.params.id,
      to_user: req.user,
    });

    let populated_user = await User.findById(req.user).populate("friends");

    return res.render("user_profile", {
      title: "Users",
      profile_user: user,
      populated_user: populated_user,
    });
  } catch (error) {
    console.log("Error finding a profile using id : ", error);
    return;
  }
};

module.exports.update = async function (req, res) {
  // if (req.user.id == req.params.id) {
  //   User.findByIdAndUpdate(req.params.id, req.body)
  //     .catch((err) => {
  //       console.log("Error in finding user in signing up ");
  //       return;
  //     })
  //     .then((user) => {
  //       return res.redirect("back");
  //     });
  // } else {
  //   return res.status(401).send("Unauthorized");
  // }

  try {
    if (req.user.id == req.params.id) {
      // let user = await User.findByIdAndUpdate(req.params.id, req.body);
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("******multer Error: ", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (
            user.avatar &&
            fs.existsSync(path.join(__dirname, "..", user.avatar))
          ) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }

          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        user.save();
        //console.log(req.file);
      });

      req.flash("success", "Profile Updated!");
      return res.redirect("back");
    } else {
      req.flash("warning", "Unauthorized!");
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.log("Error in finding user in signing up ");
    req.flash("error", error);
    return;
  }
};

//render sign up page
module.exports.signUp = function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/users/profile/" + req.user.id);
    }

    return res.render("user_sign_up", {
      title: "Codial | Sign Up",
    });
  } catch (error) {
    console.log("Error while sign up ::: ", error);
    return;
  }
};

//render sign in page
module.exports.signIn = function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/users/profile/" + req.user.id);
    }

    return res.render("user_sign_in", {
      title: "Codial | Sign In",
    });
  } catch (error) {
    console.log("Error while sign in ::: ", error);
    return;
  }
};

//get sign up data
module.exports.create = async function (req, res) {
  console.log(`Request body ${JSON.stringify(req.body)}`);
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password Mismatched!");
      return res.redirect("back");
    }
    let userFind = await User.findOne({ email: req.body.email });

    if (!userFind) {
      let user = await User.create(req.body);
      req.flash("success", "Successfully Registered!");
      return res.redirect("/users/sign-in");
    } else {
      req.flash("alert", "User already Registered!");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Error in finding user in creating user :: ", error);
    return;
  }

  // User.findOne({ email: req.body.email })
  //   .catch((err) => console.log("Error in finding user in signing up "))
  //   .then((user) => {
  //     if (!user) {
  //       User.create(req.body)
  //         .catch((err) => {
  //           console.log("Error in finding user in signing up ");
  //           return;
  //         })
  //         .then((user) => {
  //           return res.redirect("/users/sign-in");
  //         });
  //     } else {
  //       return res.redirect("back");
  //     }
  //   });
};

//Creating session for user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged In Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error in signing out user");
      return;
    }
  });
  req.flash("success", "You have Logged Out!");

  return res.redirect("/");
};
