import { Secret } from "jsonwebtoken";

export const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`;
