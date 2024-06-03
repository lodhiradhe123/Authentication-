const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    img:{
        type:String,
        default:"default.jpg",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],

})


userSchema.plugin(plm);
module.exports= mongoose.model("user", userSchema);