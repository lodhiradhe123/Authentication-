var express = require('express');
var router = express.Router();

const User = require("../model/user");
const Post = require("../model/postsschema");

const passport =require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));

const upload = require("../multer/multer");

const fs = require("fs")
const path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
 
router.post('/register',async function(req, res, next) {
  
  try {
    const {name,username,email,password}= req.body;
    const user = await User.register({name,username,email},password);
    res.redirect("/login");
  
  } catch (error) {
    console.log(error);
  }
  
  });

  router.get("/login",function(req,res,next){
    res.render("login");
  })

  router.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login",
  }), function(req,res,next){})


  router.get("/profile",isLoggedin,function(req,res,next){
    res.render("profile",{user:req.user});
  })

  function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get("/resetpassword", isLoggedin, function(req,res,next){
  res.render("resetpassword",{user:req.user})
})

router.post("/resetpassword/:id", isLoggedin, async function(req,res,next){
  await req.user.changePassword(req.body.oldpassword,req.body.newpassword);
  await req.user.save();
  res.redirect("/login")
})

router.get("/logout",isLoggedin,function(req,res,next){
  req.logout(()=>{
    res.redirect("/login")
  })
})

router.get("/update",isLoggedin,function(req,res,next){
  res.render("update",{user:req.user})
})

router.post("/update/:id",isLoggedin, async function(req,res,next){
   const userupdated = await User.findByIdAndUpdate(req.params.id, req.body)
   await userupdated.save();
   
   res.redirect("/profile");
})

router.post("/upload/:id",upload.single("img"), isLoggedin,async function(req,res,next){
  try {
    const imgname = req.file.filename;
    const user = await User.findOne({_id:req.params.id});
    user.img =imgname;
    await user.save();
    if(req.user.img!="default.jpg"){
      fs.unlinkSync(path.join(__dirname,"../","public","images", req.user.img))

    }
    res.redirect("/profile")

  } catch (error) {
   console.log(error); 
  }
})

router.get("/delete/:id",isLoggedin, async function(req,res,next){
  const deleteuser= await User.findByIdAndDelete(req.params.id);
  if(deleteuser.img!="default.jpg"){
    fs.unlinkSync(path.join(__dirname,"../","public","images", deleteuser.img))
  }
  const posts = await Post.find({user:req.params.id});
  await posts.deleteMany({user:req.params.id});
  posts.forEach((posts)=>{
    fs.unlinkSync(path.join(__dirname,"../","public","images", posts.image))
  })
  
  res.redirect("/register")
})


router.get("/posts", isLoggedin,async function(req,res,next){
const allposts = await Post.find().populate("user");
  res.render("posts",{user:req.user,allposts:allposts})
})


router.get("/createpost",isLoggedin, function(req,res,next){
  res.render("createpost",{user:req.user})
})

router.post("/createpost/:userid",isLoggedin, upload.single("image"),async function(req,res,next){
    try {
      const postdata = new Post({
        image:req.file.filename,
        description:req.body.description,
        title:req.body.title,
        user:req.user._id,
      });
      // console.log(postdata);
      req.user.posts.push(postdata._id);
      await postdata.save();
      await req.user.save();
      res.redirect("/posts")
    } catch (error) {
      console.log(error);
    }

})
router.get("/deletepost/:id",isLoggedin, async function(req,res,next){
  const delepost=await Post.findByIdAndDelete(req.params.id);
  fs.unlinkSync(path.join(__dirname,"../","public","images",delepost.image))

  res.redirect("/posts")
})


module.exports = router;
