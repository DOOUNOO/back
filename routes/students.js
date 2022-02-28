const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

const cloudinary = require("cloudinary").v2;

const Student = require("../Models/Student");

router.post("/student/signup", async (req, res) => {
  try {
    if (req.fields.username) {
      const isStudentExist = await Student.findOne({
        email: req.fields.email,
      });

      if (isStudentExist === null) {
        console.log("req.fields ===>", req.fields);

        //hash password
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(64);

        //creation of new student-profil in our database
        const newStudent = new Student({
          email: req.fields.email,
          account: {
            username: req.fields.username,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        //save profil
        await newStudent.save();
        res.json({
          _id: newStudent._id,
          email: newStudent.email,
          token: newStudent.token,
          account: newStudent.account,
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
