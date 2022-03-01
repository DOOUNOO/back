const mongoose = require("mongoose");

const Business = mongoose.model("Business", {
  email: String,
  account: {
    username: String,
    businessName: String,
    siret: String,
    referrerFirstName: String,
    referrerLastName: String,
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

module.exports = Business;
