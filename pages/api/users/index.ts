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
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users); // 200 OK
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" }); // 500 Internal Server Error
  }
}
