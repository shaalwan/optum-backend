var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var Medicine = require("../models/Medicine");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("../config");
var authenticate = require("../authenticate");

router.get(
  "/getMedicine",
  authenticate.verifyUser,
  authenticate.verifyDoctor,
  (req, res, next) => {
    Medicine.find({})
      .then((medicines) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, medicines: medicines });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/addMedicine",
  authenticate.verifyUser,
  authenticate.verifyDoctor,
  (req, res, next) => {
    Medicine.create(req.body.medicine)
      .then((medicine) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, status: "Medicine added successfully!" });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/setSchedule",
  authenticate.verifyUser,
  authenticate.verifyDoctor,
  (req, res, next) => {
    User.findById(req.body.patient)
      .then((user) => {
        //provide schedule in proper format
        user.schedule = req.body.schedule;
        user
          .save((usr) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, info: usr });
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/viewSchedule",
  authenticate.verifyUser,
  authenticate.verifyDoctor,
  (req, res, next) => {
    User.findById(req.user._id)
      .then((user) => {
        //provide schedule in proper format
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, info: usr });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports=router;
