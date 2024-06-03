const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/testauthenticatedatabas").then(()=>{
    console.log("you are connected to testauthenticatedatabas ");
}).catch((err)=>{
    console.log(err);
})