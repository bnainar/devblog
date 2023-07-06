const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const UserModel = require("./models/User");
const PostModel = require("./models/Post");
require("dotenv").config();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
const upload = multer({ dest: "uploads" });

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
    res.json({ message: "Registration successfull" });
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

    // checking passwords
    const comparePass = await bcrypt.compare(password, userDoc.passwordhash);
    if (comparePass) {
      jwt.sign(
        { username, id: userDoc._id },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw new Error(err);
          res.cookie("token", token).json({ id: userDoc._id, username });
          console.log({ token });
        }
      );
    } else {
      throw new Error("incorrect password");
    }
  } catch (e) {
    console.log({ loginerror: e });
    res.status(400).json({ error: "Wrong credentials" });
  }
});

// Validating token
app.get("/token", (req, res) => {
  if (!req.cookies) res.status(400).json("No cookies");

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) res.status(400).json("Invalid token");
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("logged out");
});

app.post("/post", upload.single("cover"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const newName = originalname + "." + parts[parts.length - 1];
  fs.renameSync(path, newName);
  const { title, subtitle, content } = req.body;
  const postDoc = await PostModel.create({
    title,
    subtitle,
    content,
    cover: newName,
  });
  res.status(200);
});

app.get("/post", async (_, res) => {
  const posts = await PostModel.find();
  res.json(posts);
});

app.listen(4000);
