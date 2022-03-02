require("dotenv").config();

const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

// Import routes
// const expertsRoutes = require("./routes/experts");
// app.use(expertsRoutes);
// const usersRoutes = require("./routes/users");
// app.use(usersRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server started 🚀");
});
