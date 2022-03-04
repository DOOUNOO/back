const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

const cloudinary = require("cloudinary").v2;

const Expert = require("../models/Expert");

//SIGNUP ------------------------------------------------------
router.post("/expert/signup", async (req, res) => {
  try {
    const expertAlreadyExists = await Expert.findOne({
      email: req.fields.email,
    });

    if (expertAlreadyExists === null) {
      console.log("req.fields ===>", req.fields);

      //hash password
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);

      //creation of new expert profile in our database
      const newExpert = new Expert({
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
      await newExpert.save();
      res.json({
        _id: newExpert._id,
        email: newExpert.email,
        token: newExpert.token,
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
router.post("/expert/login", async (req, res) => {
  try {
    const expert = await Expert.findOne({
      email: req.fields.email,
    });
    if (expert) {
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
