const express = require("express");
const router = express.Router();

// mailgun configuration
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

router.post("/contact", (req, res) => {
  console.log("data from the contact form ===>", req.fields);

  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "doounoomvp@gmail.com",
    subject: `Besoin de conseil de la part de ${req.fields.firstname} ${req.fields.lastname}`,
    text: req.fields.message,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error === undefined) {
      res.json({ message: "Form data received and email sent" });
    } else {
      res.json(error);
    }
  });
});

module.exports = router;
