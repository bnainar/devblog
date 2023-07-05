const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mernblog-cluster.1yz2pxk.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => console.log("DB connected"));

app.get("/ping", (req, res) => {
  res.json("pong");
});
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const userDoc = await UserModel.create({
      username,
      passwordhash: bcrypt.hashSync(password, salt),
    });
    console.log("New User created");
    console.log(userDoc);
    res.json({ message: "Registration succesfull" });
  } catch (e) {
    if (false) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(400).json(e);
    }
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) throw new Error("Non-existent user");
    console.log(userDoc);
    const comparePass = await bcrypt.compare(password, userDoc.passwordhash);
    if (comparePass) {
      jwt.sign(
        { username, id: userDoc._id },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw new Error("Token generation failed");
          res.cookie("token", token).json("Login successfull");
          console.log({ token });
          console.log("lllll");
        }
      );
    } else {
      throw new Error("incorrect password");
    }
  } catch (e) {
    console.log({ loginerror: e });
    res.status(400).json({ message: "Wrong credentials" });
  }
});
app.listen(4000);
