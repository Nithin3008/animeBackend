import express, { NextFunction, Request, Response } from "express";
import { authMiddleWare } from "./Auth";
import { PostSchema, UserSchema } from "../models/Model";
import { postDataType } from "../DataTypes";

export const postsRouter = express.Router();

postsRouter.get("/", authMiddleWare, async (req: Request, res: Response) => {
  const allPosts = await PostSchema.find({});
  res.status(200).json({ posts: allPosts });
});

postsRouter.post(
  "/create",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const userInfo = await UserSchema.findOne({ _id: userId1 });
    try {
      const createPost: postDataType = {
        ...req.body,
        user: userId1,
        createdAt: new Date(),
        updatedAt: "",
        likes: {
          likeCount: 0,
          likedBy: [],
        },
        comment: [],
        firstName: userInfo?.firstName,
        username: userInfo?.username,
      };
      const newPost = await new PostSchema(createPost);
      await newPost.save();
      const getAllPosts = await PostSchema.find({});
      res.status(201).json({ getAllPosts });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Something Wrong" });
    }
  }
);

postsRouter.post(
  "/editPost",
  authMiddleWare,
  async (req: Request, res: Response) => {
    try {
      const userId1 = res.locals.userId;
      console.log(req.body);
      const editPost = await PostSchema.findByIdAndUpdate(
        { _id: req.body._id },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      await editPost?.save();
      const getAllPosts = await PostSchema.find({});
      res.status(200).json({ getAllPosts });
      console.log(getAllPosts);
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Something Wrong" });
    }
  }
);
postsRouter.post(
  "/likePost/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    try {
      const x = await PostSchema.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $inc: { "likes.likeCount": 1 },
          $addToSet: { "likes.likedBy": userId1 },
        },
        { new: true }
      );
      console.log(x);
      const getAllPosts = await PostSchema.find({});
      res.status(200).json({ getAllPosts });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Something Wrong" });
    }
  }
);
postsRouter.post(
  "/unlikePost/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    try {
      const editPost = await PostSchema.findByIdAndUpdate(
        { _id: req.params.id },
        { $inc: { "likes.likeCount": -1 }, $pull: { "likes.likedBy": userId1 } }
      );
      await editPost?.save();
      const getAllPosts = await PostSchema.find({});
      res.status(200).json({ getAllPosts });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Something Wrong" });
    }
  }
);

postsRouter.delete(
  "/deletePost/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    try {
      await PostSchema.findByIdAndDelete({ _id: req.params.id });
      const getAllPosts = await PostSchema.find({});
      res.status(200).json({ getAllPosts });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Something Wrong" });
    }
  }
);

//bookmark posts
postsRouter.get(
  "/getBookmarks",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const getUserBookmarks = await PostSchema.findById({ _id: userId1 });
    res.status(200).json({ bookmarks: getUserBookmarks });
  }
);

postsRouter.post(
  "/addBookmark/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const saveBookmark = await UserSchema.findByIdAndUpdate(
      { _id: userId1 },
      { $addToSet: { bookmark: req.params.id } },
      { new: true }
    );
    console.log(saveBookmark?.bookmark);
    res.status(201).json({ bookmarks: saveBookmark?.bookmark });
  }
);
postsRouter.post(
  "/removeBookmark/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const saveBookmark = await UserSchema.findByIdAndUpdate(
      { _id: userId1 },
      { $pull: { bookmark: req.params.id } },
      { new: true }
    );
    console.log(saveBookmark?.bookmark);
    res.status(201).json({ bookmarks: saveBookmark?.bookmark });
  }
);
