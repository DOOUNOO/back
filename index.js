require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//middleware
app.use(formidable());
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
