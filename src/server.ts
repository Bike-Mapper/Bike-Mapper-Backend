import "../config/database";
import bodyParser from "body-parser";
import express from "express";

import auth from "./routes/api/auth";
import user from "./routes/api/user";
import profile from "./routes/api/profile";
import connectDB from "../config/database";
// import userSchema from "./models/User";

const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB

connectDB();
console.log("gggggggg");

// mongoose.model('User', userSchema);
// await mongoose.model('User').findOne();

// Express configuration
app.set("port", process.env.API_PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/profile", profile);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
