import jwt, { JwtPayload as JwtLibPayload } from "jsonwebtoken";
import { IUser } from "../models/User.model";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt";

export interface AppJwtPayload extends JwtLibPayload {
  sub: string;
  role: string;
  status: string;
  tokenVersion: number;
}

export const signTokens = (user: IUser) => {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    status: user.status,
    tokenVersion: user.tokenVersion
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const signToken = (user: IUser): string => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      status: user.status,
      tokenVersion: user.tokenVersion
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
};

export const verifyToken = (token: string): AppJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as AppJwtPayload;
};
