const mongoose = require("mongoose");

const Student = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    firstName: String,
    lastName: String,
    educationalEstablishment: String,
    phone: String,
    avatar: Object,
    description: String,
    languages: String,
    education: String,
    diplomas: String,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = Student;
