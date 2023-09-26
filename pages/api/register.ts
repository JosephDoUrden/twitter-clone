import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if(req.method !== "POST") {
    return res.status(500).json({ message: "Only POST requests allowed" }); // 500 Internal Server Error
  }

  try {
    const { email, username, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        hashedPassword
      }
    });

    return res.status(201).json({ message: "User created" }); // 201 Created

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" }); // 400 Bad Request
  }
}