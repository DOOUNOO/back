const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(cors());

// Import routes

mongoose.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
