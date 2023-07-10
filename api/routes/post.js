import express from "express";
import PostModel from "../models/Post.js";
import multer from "multer";
import fs from "fs";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import UserModel from "../models/User.js";

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

router.put("/", [verifyjwt, upload.single("cover")], async (req, res) => {
  const postDoc = await PostModel.findById(req.body.postId);
  if (req.userInfo.id != postDoc.author) res.status(403);
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    newPath = path + "." + parts[parts.length - 1];
    fs.renameSync(path, newPath);
  }
  const { title, subtitle, content } = req.body;
  postDoc.title = title;
  postDoc.subtitle = subtitle;
  postDoc.content = content;
  postDoc.cover = newPath ?? postDoc.cover;

  await postDoc.save();
  res.status(200).json(postDoc);
});

router.delete("/", verifyjwt, async (req, res) => {
  const postDoc = await PostModel.findById(req.body.postId);
  if (req.userInfo.id != postDoc.author) res.status(403);
  await PostModel.deleteOne({ _id: req.body.postId });
  res.status(200).json("deleted");
});

router.get("/", async (_, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(10)
    .select("author title subtitle cover createdAt");
  res.json(posts);
});
router.get("/author/:authorName", async (req, res) => {
  const authorDoc = await UserModel.findOne({
    username: req.params.authorName,
  });
  if (!authorDoc) res.status(404);

  const posts = await PostModel.find({ author: authorDoc._id })
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(10)
    .select("author title subtitle cover createdAt");
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id).populate("author", [
      "username",
    ]);
    if (postDoc == null) throw new Error();
    res.json(postDoc);
  } catch (error) {
    res.status(404).json("Post not found");
  }
});

export default router;
