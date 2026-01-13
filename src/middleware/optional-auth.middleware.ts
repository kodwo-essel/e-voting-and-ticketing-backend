import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User.model";

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No token provided, continue without user info
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub);

    if (user && user.tokenVersion === decoded.tokenVersion) {
      (req as any).user = {
        id: decoded.sub,
        role: decoded.role,
        status: decoded.status,
        tokenVersion: decoded.tokenVersion
      };
    }
  } catch {
    // Invalid token, continue without user info
  }
  
  next();
};