const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

// const cloudinary = require("cloudinary").v2;

const Expert = require("../models/Expert");

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
          lastName: req.fields.account.lastName,
          activateOffer: false,
          availabilities: {
            monday: false,
            tuesday: false,
            wednesday: false,
            friday: false,
            saturday: false,
            sunday: false,
          },
        },
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
