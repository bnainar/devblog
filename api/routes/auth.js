import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express from "express";
import UserModel from "../models/User.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import { loginSchema, registerSchema } from "../schemas/zodSchemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), async (req, res) => {
  const { username, password } = req.body;
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

router.post("/login", validateSchema(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) throw new Error("Non-existent user");

    // checking passwords
    const comparePass = await bcrypt.compare(password, userDoc.passwordhash);
    if (!comparePass) throw new Error("incorrect password");

    jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: 180 },
      (err, token) => {
        if (err) throw new Error(err);
        res
          .cookie("token", token, {
            secure: true,
            maxAge: 180000,
            httpOnly: true,
            sameSite: "none",
          })
          .json({ id: userDoc._id, username });
      }
    );
  } catch (e) {
    console.log({ loginerror: e });
    res.sendStatus(400);
  }
});

// Validating token
router.get("/token", verifyjwt, (req, res) => res.json(req.userInfo));

router.post("/logout", (_, res) => {
  res
    .clearCookie("token", {
      secure: true,
      maxAge: 180000,
      httpOnly: true,
      sameSite: "none",
    })
    .sendStatus(200);
});

export default router;
