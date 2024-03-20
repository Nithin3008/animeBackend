import { userDataType } from "../DataTypes";
import { UserSchema } from "../models/Model";
import { authMiddleWare } from "./Auth";
import express, { Request, Response } from "express";
export const userRouter = express.Router();

userRouter.get(
  "/allUsers",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const getUsers: userDataType[] = await UserSchema.find({});
    res.status(200).json({ users: getUsers });
  }
);

userRouter.post(
  "/editUser",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const updateUser: userDataType | null = await UserSchema.findByIdAndUpdate(
      { _id: userId1 },
      req.body,
      { new: true }
    );
    // const getUsers: userDataType[] = await UserSchema.find({});
    res.status(200).json({ user: updateUser });
  }
);

userRouter.post(
  "/followUser/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const followID = req.params.id;
    console.log(followID);
    try {
      const followersList = await UserSchema.findByIdAndUpdate(
        { _id: userId1 },
        { $addToSet: { following: followID } },
        { new: true }
      );
      console.log(followersList);
      res.status(200).json({ followers: followersList?.following });
    } catch (error) {
      console.log(error);
    }
  }
);
userRouter.post(
  "/unFollowUser/:id",
  authMiddleWare,
  async (req: Request, res: Response) => {
    const userId1 = res.locals.userId;
    const followID = req.params.id;
    try {
      const followersList = await UserSchema.findByIdAndUpdate(
        { _id: userId1 },
        { $pull: { following: followID } },
        { new: true }
      );
      console.log(followersList, followID);
      res.status(200).json({ followers: followersList?.following });
    } catch (error) {
      console.log(error);
    }
  }
);
