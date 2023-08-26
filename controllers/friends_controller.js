const Friendship = require("../models/friendships");
const User = require("../models/user");

module.exports.addFriend = async function (req, res) {
  try {
    let existingFriendship = await Friendship.findOne({
      from_user: req.user,
      to_user: req.query.id,
    });

    let toUser = await User.findById(req.query.id);
    let fromUser = await User.findById(req.user);

    let deleted = false;
    let friendship;
    if (existingFriendship) {
      toUser.friends.pull(existingFriendship._id);
      fromUser.friends.pull(existingFriendship._id);
      toUser.save();
      fromUser.save();

      await existingFriendship.deleteOne();
      deleted = true;
      removeFriend = true;
    } else {
      friendship = await Friendship.create({
        from_user: fromUser,
        to_user: toUser,
      });

      toUser.friends.push(friendship);
      fromUser.friends.push(friendship);
      toUser.save();
      fromUser.save();
    }

    console.log(friendship);
    return res.redirect("back");
  } catch (error) {
    console.log("Error in deleting or adding friend : ", error);
    return res.redirect("back");
  }
};
