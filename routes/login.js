const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");
const Expert = require("../models/Expert");

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.fields.email,
    });
    const expert = await Expert.findOne({
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
    } else if (expert) {
      console.log(expert.hash, "Hash to compare");
      const newHash = SHA256(req.fields.password + expert.salt).toString(
        encBase64
      );
      console.log(newHash, "New hash");
      if (expert.hash === newHash) {
        res.json({
          message: "Welcome !",
          _id: expert._id,
          token: expert.token,
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
