import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * This allows us to safely use req.userId in your Express application with proper type checking
 * and IntelliSense in TypeScript. Without this declaration, TypeScript would throw an error
 * if you tried to access req.userId because it doesn't exist in the default Request interface.
 */

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies["auth_token"];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
};

export default verifyToken;
