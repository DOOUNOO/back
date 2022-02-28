const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

const cloudinary = require("cloudinary").v2;

const Business = require("../Models/Business");
const Student = require("../models/Student");

router.post("/business/signup", async (req, res) => {
  try {
    if (req.fields.username) {
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
          account: {
            username: req.fields.username,
          },
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
          account: newBusiness.account,
        });
      } else {
        res.status(400).json({
          message: "This email already has an account",
        });
      }
    } else {
      res.status(400).json({
        message: "Please enter your username",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
