import express from "express";
import PostModel from "../models/Post.js";
import multer from "multer";
import fs from "fs";
import { verifyjwt } from "../middlewares/verifyjwt.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", [verifyjwt, upload.single("cover")], async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const newName = path + "." + parts[parts.length - 1];
  fs.renameSync(path, newName);

  const { title, subtitle, content } = req.body;
  const { _id } = await PostModel.create({
    author: req.userInfo.id,
    title,
    subtitle,
    content,
    cover: newName,
  });
  res.status(200).json({ id: _id });
});

router.delete("/:id", verifyjwt, async (req, res) => {
  console.log(req.userInfo);
  res.status(200);
});

router.get("/", async (_, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id).populate("author", [
      "username",
    ]);
    if (postDoc == null) throw new Error();
    console.log(postDoc);
    res.json(postDoc);
  } catch (error) {
    res.status(404).json("Post not found");
  }
});

export default router;
