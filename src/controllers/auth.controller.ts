import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../middleware/error.middleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(result);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body.token);
  res.json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  res.json(result);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body.email);
  res.json(result);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.resetPassword(req.body.token, req.body.password);
  res.json(result);
});
