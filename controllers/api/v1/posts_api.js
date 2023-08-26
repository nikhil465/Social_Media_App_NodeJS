const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {
    //older version
    // return res.json(200, {
    //     message: "List of Posts",
    //     posts: []
    // });

    let posts = await Post.find({}).sort('-createdAt')
        .select('-_id -__v')
        .populate({
            path: "user",
        })
        .select('-_id -__v -password')
        .populate({
            path: "comments",
            populate: "user",
        }).select('-_id -__v -password');

    return res.status(200).json({

        message: "List of Posts",
        posts: posts

    });
}

module.exports.destroy = async function (req, res) {

    try {
        let post = await Post.findById(req.params.id);

        //.id means converting the object Id into string
        if (post.user == req.user.id) {
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });

            //req.flash("success", "Post Deleted!");
            return res.status(200).json({
                message: "Post and associated comments deleted successfully!"
            });
        } else {
            return res.status(401).json({
                message: "You cannot delete this post"
            })
        }

    } catch (error) {
        console.log("Error while destoying post :::", error);
        //   req.flash("error", "You cannot delete this post!");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
