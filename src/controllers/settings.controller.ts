import { Request, Response } from "express";
import { SettingsService } from "../services/settings.service";
import { asyncHandler } from "../middleware/error.middleware";

export const updateSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const setting = await SettingsService.updateSetting(key, value, req.user!.id);
  res.json(setting);
});

export const getSetting = asyncHandler(async (req: Request, res: Response) => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  const value = await SettingsService.getSetting(key);
  res.json({ key, value });
});

export const getAllSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.getAllSettings();
  res.json(settings);
});