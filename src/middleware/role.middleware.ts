import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User.model";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;

    // Should never happen if authenticate middleware ran
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Account must be active
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Account is not active"
      });
    }

    // Role check
    if (!allowedRoles.includes(user.role as UserRole)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions"
      });
    }

    next();
  };
};
