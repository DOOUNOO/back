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
const studentsRoutes = require("./routes/students");
app.use(studentsRoutes);
const businessesRoutes = require("./routes/businesses");
app.use(businessesRoutes);
mongoose.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
