const mongoose = require("mongoose");

const Expert = mongoose.model("Expert", {
  email: String,
  account: {
    firstName: String,
    lastName: String,
    avatar: Object,
    titleDescription: String,
    description: String,
    languages: String,
    education: String,
    diplomas: String,
    category: String,
    subcategory: String,
    keywords: String,
    hourlyPrice: Number,
    totalOrder: Number,
    totalReview: Number,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = Expert;
