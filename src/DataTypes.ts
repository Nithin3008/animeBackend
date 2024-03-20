import z from "zod";
const commentZodType = z.object({
  username: z.string(),
  img: z.string(),
  content: z.string(),
});
export const postType = z.object({
  content: z.string(),
  likes: z
    .object({
      likeCount: z.number(),
      likedBy: z.array(z.string()),
    })
    .optional(),
  user: z.string().optional(),
  comment: z.array(commentZodType).optional(),
  img: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const singupType = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
  bio: z.string().optional(),
  portfolio: z.string().optional(),
  avatar: z.string().optional(),
  bookmarks: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
  followers: z.array(z.string()).optional(),
});
export const signinType = z.object({
  username: z.string(),
  password: z.string(),
});

type commentDataType = z.infer<typeof commentZodType>;

export interface userDataType {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  bio?: string;
  portfolio?: string;
  avatar?: string;
  bookmarks: [String];
  img?: string;
}

export type postDataType = {
  _id: string;
  content: string;
  img?: string;
  likes?: {
    likeCount: number;
    likedBy: string[];
  };
  user: string;
  comment?: commentDataType[];
  createdAt?: Date;
  updatedAt?: Date;
};
