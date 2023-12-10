var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/profile", isLoggedIn ,function(req,res,next){
  res.render("profile")
})

router.post("/register", async function(req,res){
  // const userData = new userModel({
  //   usrname:req.body.usrname,
  //   email:req.body.email,
  //   fullName:req.body.fullName
  // })
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname});
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile");
    });
  });
});

router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req,res){
});

router.get("/logout", function(req,res){
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect("/");
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

// router.get("/alluserposts", async function(req,res,next){
//   let user = await userModel.findOne({_id: "655e1ed7a3cf53d14288a625"}).populate("posts");
//   res.send(user);

// })

// router.get("/createuser", async function(req,res,next){
//   let createUser = await userModel.create({
//     username:"farhan",
//     password:"23456llqadkw",
//     posts:[],
//     email:"farhan@gmail.com",
//     fullName:"farhan" 
//   });
//   res.send(createUser);
// });

// router.get("/createpost", async function(req,res,next){
//   let createPost = await postModel.create({
//    postText:"Welcome hello worldl",
//    user:"655e1ed7a3cf53d14288a625"
//   });
//   let user = await userModel.findOne({_id: "655e1ed7a3cf53d14288a625"});
//   user.posts.push(createPost._id);
//   await user.save();
//   res.send("done")
// });


module.exports = router;
