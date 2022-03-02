const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  username: String,
  account: {
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
