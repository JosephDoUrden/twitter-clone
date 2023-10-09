import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function follow(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" }); // Return 405 if method not allowed
  }

  try {
    const { userId } = req.body; // Get userId from body

    const { currentUser } = await serverAuth(req, res); // Get current user from server

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID"); // Throw error if userId is not valid
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }, // Find user by userId
    });

    if (!user) {
      throw new Error("User not found"); // Throw error if user not found
    }

    let updatedFollowingIds = [...(user.followingIds || [])]; // Get followingIds from user

    if (req.method === "POST") {
      updatedFollowingIds.push(userId); // Add userId to followingIds
    }

    if (req.method === "DELETE") {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      ); // Remove userId from followingIds
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id }, // Find current user
      data: { followingIds: updatedFollowingIds }, // Update followingIds
    });

    return res.status(200).json(updatedUser); // Return updated user
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" }); // Return 500 if error
  }
}
