const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

const cloudinary = require("cloudinary").v2;

const Business = require("../models/Business");
const { route } = require("./students");

//SIGNUP ------------------------------------------------------
router.post("/business/signup", async (req, res) => {
  try {
    const isBusinessExist = await Business.findOne({
      email: req.fields.email,
    });

    if (isBusinessExist === null) {
      console.log("req.fields ===>", req.fields);

      //hash password
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);

      //creation of new business-profil in our database
      const newBusiness = new Business({
        email: req.fields.email,
        token: token,
        hash: hash,
        salt: salt,
      });

      //save profil
      await newBusiness.save();
      res.json({
        _id: newBusiness._id,
        email: newBusiness.email,
        token: newBusiness.token,
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

router.post("/business/login", async (req, res) => {
  try {
    const business = await Business.findOne({
      email: req.fields.email,
    });
    if (business) {
      console.log(business.hash, "Hash to compare");
      const newHash = SHA256(req.fields.password + business.salt).toString(
        encBase64
      );
      console.log(newHash, "New hash");
      if (business.hash === newHash) {
        res.json({
          message: "Welcome !",
          _id: business._id,
          token: business.token,
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
