import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: String },
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);

export default PostModel;
