const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

const isAuthenticated = require("../isAuthenticated");

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
          category: "",
          subcategory: "",
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

router.patch("/account/:id", async (req, res) => {
  const newEmail = req.fields.email;
  const newFirstName = req.fields.account.firstName;
  const newLastName = req.fields.account.lastName;
  const newActivateOffer = req.fields.account.activateOffer;
  const newCategory = req.fields.account.category;
  const newSubcategory = req.fields.account.subcategory;

  const expertToUpdate = await Expert.findByIdAndUpdate(req.params.id);

  try {
    if (newEmail && newEmail !== "" && newEmail !== expertToUpdate.email) {
      expertToUpdate.email = newEmail;
    }

    if (newFirstName && newFirstName !== "") {
      expertToUpdate.account.firstName = newFirstName;
    }

    if (newLastName && newLastName !== "") {
      expertToUpdate.account.lastName = newLastName;
    }

    if (
      newActivateOffer &&
      newActivateOffer !== expertToUpdate.account.ActivateOffer
    ) {
      expertToUpdate.account.activateOffer = newActivateOffer;
    }

    if (newCategory && newCategory !== expertToUpdate.account.category) {
      expertToUpdate.account.category = newCategory;
    }

    if (
      newSubcategory &&
      newSubcategory !== expertToUpdate.account.subcategory
    ) {
      expertToUpdate.account.subcategory = newSubcategory;
    }

    await expertToUpdate.save();

    res.status(200).json("Expert updated succesfully !");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/account/:id", async (req, res) => {
  try {
    const expertFinded = await Expert.findOne({ _id: req.params.id });
    res.json(expertFinded);
  } catch (error) {
    res.status(400).json("non");
  }
});

module.exports = router;
