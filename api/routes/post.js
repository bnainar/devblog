import express from "express";
import PostModel from "../models/Post.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import UserModel from "../models/User.js";

import { postSchema } from "../schemas/zodSchemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const router = express.Router();

router.post("/", [verifyjwt, validateSchema(postSchema)], async (req, res) => {
  const { title, subtitle, content, cover } = req.body;

  const newPostDoc = await PostModel.create({
    author: req.userInfo.id,
    title,
    subtitle,
    content,
    cover,
  });
  res.status(200).json({ post: newPostDoc });
});

router.put("/", [verifyjwt, validateSchema(postSchema)], async (req, res) => {
  if (!req.body?.postId) return res.sendStatus(404);

  const postDoc = await PostModel.findById(req.body.postId);
  if (!postDoc) return res.sendStatus(404);
  if (req.userInfo.id != postDoc.author) return res.sendStatus(403);

  const { title, subtitle, content, cover } = req.body;

  postDoc.title = title;
  postDoc.subtitle = subtitle;
  postDoc.content = content;
  postDoc.cover = cover;

  await postDoc.save();
  res.status(200).json(postDoc);
});

router.delete("/", verifyjwt, async (req, res) => {
  const { postId } = req.body;
  if (!postId) res.sendStatus(404);

  const postDoc = await PostModel.findById(postId);
  if (req.userInfo.id != postDoc.author) res.sendStatus(403);

  await PostModel.deleteOne({ _id: postId });
  res.sendStatus(200);
});

router.get("/all", async (req, res) => {
  const resultsPerPage = req.query.limit ?? 2;
  const page = req.query.page >= 1 ? req.query.page : 0;

  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .select("author title subtitle cover createdAt");
  const count = await PostModel.countDocuments();
  const hasNextPage = resultsPerPage * (page + 1) < count;
  const nextPageCursor = hasNextPage ? page + 1 : null;
  res.json({ posts, count, nextPageCursor });
});

router.get("/author/:authorName", async (req, res) => {
  const resultsPerPage = req.query.limit ?? 2;
  const page = req.query.page >= 1 ? req.query.page : 0;

  if (!req.params.authorName) res.sendStatus(400);
  const authorDoc = await UserModel.findOne({
    username: req.params.authorName,
  });
  if (authorDoc == null) res.sendStatus(404);

  const posts = await PostModel.find({ author: authorDoc._id })
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .select("author title subtitle cover createdAt");
  const count = await PostModel.countDocuments({ author: authorDoc._id });
  const hasNextPage = resultsPerPage * (page + 1) < count;
  const nextPageCursor = hasNextPage ? page + 1 : null;
  res.json({ posts, count, nextPageCursor });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) res.sendStatus(400);
  try {
    const postDoc = await PostModel.findById(id).populate("author", [
      "username",
    ]);
    if (postDoc == null) throw new Error();
    res.json(postDoc);
  } catch (error) {
    res.sendStatus(404);
  }
});

export default router;
