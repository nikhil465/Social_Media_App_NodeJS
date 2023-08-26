const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    let comment = await Comment.create({
      content: req.body.comment,
      post: req.body.post,
      user: req.user._id,
    });
    post.comments.push(comment);
    await post.save();
    comment = await comment.populate("user", "name email");
    // commentsMailer.newComment(comment);
    let job = queue.create("emails", comment).save(function (err) {
      if (err) {
        console.log("Error in creating a queue");
      }
      console.log(job.id);
    });

    req.flash("success", "Comment Published!");
    return res.redirect("/");
  } catch (error) {
    console.log("Error in creating a comment :::", error);
    req.flash("error", "You cannot comment on this post!");
    return;
  }

  // Post.findById(req.body.post)
  //   .catch((err) => {
  //     console.log("Error in finding the post");
  //     return;
  //   })
  //   .then((post) => {
  //     Comment.create({
  //       content: req.body.comment,
  //       post: req.body.post,
  //       user: req.user._id,
  //     })
  //       .catch((err) => {
  //         console.log("Error in creating a comment");
  //         return;
  //       })
  //       .then((comment) => {
  //         post.comments.push(comment);
  //         post.save();
  //       });

  //     return res.redirect("/");
  //   });
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      await comment.deleteOne();
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });
    }
    req.flash("success", "Comment Deleted!");
    return res.redirect("back");
  } catch (error) {
    console.log("Error destroying comment ::: ", error);
    req.flash("error", "You cannot delete comment on this post!");
    return;
  }

  // Comment.findById(req.params.id)
  //   .catch((err) => {
  //     console.log("Error finding comment");
  //     return;
  //   })
  //   .then((comment) => {
  //     if (comment.user == req.user.id) {
  //       let postId = comment.post;
  //       comment.deleteOne();
  //       Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
  //         .catch((err) => {
  //           console.log("Error finding post");
  //           return;
  //         })
  //         .then((post) => {
  //           return res.redirect("back");
  //         });
  //     } else {
  //       return res.redirect("back");
  //     }
  //   });
};
