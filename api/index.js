import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: process.env.CLIENT_DOMAIN }));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mernblog-cluster.1yz2pxk.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => console.log("DB connected"));

app.get("/ping", (_, res) => res.json("pong"));

app.use("/post", postRouter);
app.use("/auth", authRouter);

app.listen(4000);
