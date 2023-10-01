import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" }); // 405 Method Not Allowed
  }
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      throw new Error("User ID not provided");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    return res.status(200).json({ ...existingUser, followersCount }); // 200 OK
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" }); // 500 Internal Server Error
  }
}
