import express from "express";
import { authRouter } from "./routes/Auth";
import mongoose from "mongoose";
import { userRouter } from "./routes/Users";
import { postsRouter } from "./routes/Posts";
import cors from "cors";
const app = express();
const dbString: string = process.env.DATBASE_URL!;
mongoose.connect(dbString, { dbName: "animverse" });
app.use(cors());
app.use(express.json());
app.use("/animeverse/authy", authRouter);
app.use("/animeverse/users", userRouter);
app.use("/animeverse/posts", postsRouter);
app.listen(3000, () => {
  console.log("server is up");
});
