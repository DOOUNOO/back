const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

// const cloudinary = require("cloudinary").v2;

const Expert = require("../models/Expert");

router.post("/expert/signup", async (req, res) => {
  try {
    const isExpertExist = await Expert.findOne({
      email: req.fields.email,
    });

    if (isExpertExist === null) {
      console.log("req.fields ===>", req.fields);

      //hash password
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);

      //creation of new student-profil in our database
      const newExpert = new Expert({
        email: req.fields.email,
        token: token,
        hash: hash,
        salt: salt,
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

module.exports = router;
