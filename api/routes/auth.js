import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express from "express";
import UserModel from "../models/User.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || username.length < 4 || !password || password.length < 6)
    res.sendStatus(400);
  try {
    const salt = await bcrypt.genSalt();
    await UserModel.create({
      username,
      passwordhash: bcrypt.hashSync(password, salt),
    });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || username.length < 4 || !password || password.length < 6)
    res.sendStatus(400);
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) throw new Error("Non-existent user");

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
router.get("/token", verifyjwt, (req, res) => {
  res.json(req.userInfo);
});

router.post("/logout", (_, res) => {
  res.cookie("token", "").json("logged out");
});

export default router;
