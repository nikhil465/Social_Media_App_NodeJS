const mongoose = require("mongoose");

const friendshipsSchema = new mongoose.Schema({
    to_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    } , 
    from_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    } , 
} , {
    timeStamps : true
})

const Friendship = mongoose.model("Friendship" , friendshipsSchema);
module.exports = Friendship;