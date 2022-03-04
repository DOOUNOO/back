const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

const cloudinary = require("cloudinary").v2;

const User = require("../models/User");
//const { route } = require("./experts");

//SIGNUP ------------------------------------------------------
router.post("/user/signup", async (req, res) => {
  try {
    const userAlreadyExists = await User.findOne({
      email: req.fields.email,
    });

    if (userAlreadyExists === null) {
      console.log("req.fields ===>", req.fields);

      //hash password
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);

      //creation of new user profile in our database
      const newUser = new User({
        email: req.fields.email,
        token: token,
        hash: hash,
        salt: salt,
        account: {
          firstName: req.fields.account.firstName,
          lastName: req.fields.account.lastName
        }
      });

      //save profil
      await newUser.save();
      res.json({
        _id: newUser._id,
        email: newUser.email,
        token: newUser.token,
      });
    } else {
      res.status(400).json({
        message: "This email already has an account",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

//LOGIN ------------------------------------------------------

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.fields.email,
    });
    if (user) {
      console.log(user.hash, "Hash to compare");
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      console.log(newHash, "New hash");
      if (user.hash === newHash) {
        res.json({
          message: "Welcome !",
          _id: user._id,
          token: user.token,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized - 2",
        });
      }
    } else {
      res.status(401).json({
        message: "Unauthorized - 1",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
