var express = require('express');
var router = express.Router();
var User = require("../models/User.js");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("../config");
var authenticate = require("../authenticate");

//get all patients
router.get("/getPatients",authenticate.verifyUser,authenticate.verifyDoctor,(req,res,next)=>{
  User.find({user_type:'patient'}).then((users)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, users:users });
  })
  .catch((err)=>{
    next(err);
  });
});
//getUserInfo
router.get("/userInfo",authenticate.verifyUser, (req,res,next)=>{
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, userInfo: req.user });
});

//SignUp a new user with username and password
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  User.register(
    new User({
      username: req.body.username,
      user_type: req.body.user_type,
      firstName:req.body.firstName,
      lastName:req.body.lastName
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err, req.body);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        //using local strategy to authenticate the user and checking he is registered properly
        passport.authenticate("local")(req, res, () => {
          console.log(req.user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

//Login a user and return the jwt-token
router.post("/login", (req, res, next) => {
  //Using local strategy to login
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    } else {
      console.log(user);

      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: false,
            status: "Login Unsuccessful!",
            err: "Could not log in user!",
          });
        }
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Successfully logged In!",
          token: token,
          user: req.user,
        });
      });
    }
  })(req, res, next);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
