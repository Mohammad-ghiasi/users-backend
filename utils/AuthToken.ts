import jwt from "jsonwebtoken";
import { Request } from "express";

export interface DecodedToken {
  userId: string;
  email: string;
}

export const verifyToken = (req: Request): DecodedToken | null => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.MY_SECRET_USERSTASK as string) as DecodedToken;
    return decoded; 
  } catch {
    return null;
  }
};
