import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { asyncHandler } from "../middleware/error.middleware";

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.createAdmin(req.body);
  res.status(201).json(result);
});

export const approveOrganizer = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await AdminService.approveOrganizer(id);
  res.json(result);
});
