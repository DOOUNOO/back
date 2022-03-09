const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  avatarUrl: String,
  account: {
    firstName: String,
    lastName: String,
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
