import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User.model";

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    role: UserRole;
    status: "PENDING" | "ACTIVE" | "DISABLED";
  };
}

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
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
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions"
      });
    }

    next();
  };
};
