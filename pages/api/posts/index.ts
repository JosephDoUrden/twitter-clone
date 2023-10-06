import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    // Return 405 if method not allowed
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res); // Get current user from token
      const { body } = req.body; // Get body from request

      const post = await prisma.post.create({
        // Create post
        data: {
          body,
          userId: currentUser.id,
        },
      });

      return res.status(200).json(post); // Return 200 with post
    }

    if (req.method === "GET") {
      const { userId } = req.query;

      let posts;

      if (userId && typeof userId === "string") {
        posts = await prisma.post.findMany({
          where: {
            userId,
          },
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
      return res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" }); // Return 500 if something goes wrong
  }
}
