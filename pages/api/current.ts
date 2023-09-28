import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(500).json({ message: "Only GET requests allowed" }); // 500 Internal Server Error
  }

  try {
    const { currentUser } = await serverAuth(req);

    return res.status(200).json(currentUser); // 200 OK
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" }); // 400 Bad Request
  }
}
