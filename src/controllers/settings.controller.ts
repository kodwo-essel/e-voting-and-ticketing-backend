import { Request, Response } from "express";
import { Settings } from "../models/Settings.model";
import { AppError } from "../middleware/error.middleware";

export class SettingsController {
  static async getPaymentGateway(req: Request, res: Response) {
    const setting = await Settings.findOne({ key: "payment_gateway" });
    
    res.json({
      success: true,
      data: {
        gateway: setting?.value || "paystack"
      }
    });
  }

  static async setPaymentGateway(req: Request, res: Response) {
    const { gateway } = req.body;
    
    if (!["paystack", "flutterwave", "appsmobile"].includes(gateway)) {
      throw new AppError("Invalid payment gateway", 400);
    }

    await Settings.findOneAndUpdate(
      { key: "payment_gateway" },
      { 
        value: gateway,
        updatedBy: req.user.id
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Payment gateway updated to ${gateway}`
    });
  }
}