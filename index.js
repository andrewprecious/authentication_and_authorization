const express = require("express");
const app = express();
const port = 5000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const auth_route = require("./routes/auth_route");
const user_route = require("./routes/user_route");

dotenv.config();

app.use(express.urlencoded({ extended: true }));

// to use json in express
app.use(express.json());

// connecting to database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected successfully to DB");
    app.listen(port, (req, res) => {
      console.log(`Listening to requests comin from ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//   routes link
app.use("/account", auth_route);
app.use("/user", user_route);
