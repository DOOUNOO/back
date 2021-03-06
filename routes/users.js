const express = require("express");
const router = express.Router();
const formidableMiddleware = require("express-formidable");
router.use(formidableMiddleware());
const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

// const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

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
          lastName: req.fields.account.lastName,
        },
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

router.get("/users/:token", async (req, res) => {
  try {
    const userFound = await User.findOne({ token: req.params.token });
    res.json(userFound);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user", async (req, res) => {
  try {
    const userToken = req.fields.token;
    const userFound = await User.findOne({ token: userToken });
    res.json(userFound);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
