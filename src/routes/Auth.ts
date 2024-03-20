import express, { NextFunction, Request, Response } from "express";
import { UserSchema } from "../models/Model";
import bcrypt from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { signinType, singupType, userDataType } from "../DataTypes";
export const authRouter = express.Router();
dotenv.config();

const jwtSecret: string = process.env.JWT_SECRET!;

//routes start
authRouter.post("/signup", async (req: Request, res: Response) => {
  const { success } = singupType.safeParse(req.body);
  if (success) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUserDetails = { ...req.body, password: hashPassword };

    try {
      const newUser = new UserSchema(newUserDetails);
      await newUser.save();
      const token = sign({ id: newUser._id }, jwtSecret);
      res.status(201).json({ message: "sucessfully created user", token });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(403).json({ message: "Please enter proper input" });
  }
});

//signin
authRouter.post("/signin", async (req: Request, res: Response) => {
  const { success } = signinType.safeParse(req.body);
  if (success) {
    const findUser: userDataType | null = await UserSchema.findOne({
      username: req.body.username,
    });
    if (findUser) {
      const checker = await bcrypt.compare(
        req.body.password,
        findUser?.password
      );
      if (checker) {
        const token = sign({ id: findUser._id }, jwtSecret);
        res.status(200).json({ token, user: findUser });
      } else {
        res.status(403).json({ message: "wrong password" });
      }
    } else {
      res.status(403).json({ message: "user not found" });
    }
  } else {
    res.status(403).json({ message: "Please enter correct input" });
  }
});

export function authMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers.authorization;
  if (headers) {
    const check = verify(headers, jwtSecret) as JwtPayload;
    res.locals.userId = check?.id;
    next();
  }
}
