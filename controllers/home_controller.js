const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  //console.log(req.user);
  // Post.find({})
  //   .catch((err) => {
  //     console.log("Error in finding the posts");
  //     return;
  //   })
  //   .then((posts) => {
  //     //console.log(posts);
  //     return res.render("home", {
  //       title: "Home",
  //       posts: posts,
  //     });
  //   });

  //Using then
  // Post.find({})
  //   .populate({
  //     path: "user",
  //   })
  //   .populate({
  //     path: "comments",
  //     populate: "user",
  //   })
  //   .exec()
  //   .catch((err) => {
  //     console.log("Error in finding the posts ::: ", err);
  //     return;
  //   })
  //   .then((posts) => {
  //     //console.log(posts);
  //     User.find({}).then((users) => {
  //       return res.render("home", {
  //         title: "Home",
  //         posts: posts,
  //         all_users: users,
  //       });
  //     });
  //   });

  try {
    //Using Async and await
    let posts = await Post.find({})
      .sort("-createdAt")

      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user")
      .populate("likes");
    //console.log(posts);
    let users = await User.find({});
    let user;
    if (req.user) {
      user = await User.findById(req.user._id)
        .populate({
          path: "friends",
          populate: {
            path: "from_user",
          },
        })
        .populate({
          path: "friends",
          populate: {
            path: "to_user",
          },
        });
    }

    return res.render("home", {
      title: "Home",
      posts: posts,
      all_users: users,
      user: user,
    });
  } catch (error) {
    console.log("Error :::", error);
    return;
  }
};
