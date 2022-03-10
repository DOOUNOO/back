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
    avatarURL: String,
    socialMedias: {
      linkedin: String,
      instagram: String,
    },
    activateOffer: Boolean,
    availabilities: {
      Lundi: Boolean,
      Mardi: Boolean,
      Mercredi: Boolean,
      Jeudi: Boolean,
      Vendredi: Boolean,
      Samedi: Boolean,
      Dimanche: Boolean,
      hoursAvailable: {
        from: Number,
        to: Number,
      },
    },
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = Expert;
