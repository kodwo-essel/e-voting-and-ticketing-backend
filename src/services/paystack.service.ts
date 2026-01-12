import axios from "axios";
import { AppError } from "../middleware/error.middleware";

export class PaystackService {
  private static baseURL = "https://api.paystack.co";
  private static secretKey = process.env.PAYSTACK_SECRET_KEY;

  static async initializePayment(data: {
    email: string;
    amount: number;
    reference: string;
    callback_url?: string;
    metadata?: any;
  }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        {
          ...data,
          amount: data.amount * 100, // Convert to kobo
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error("Paystack initialization error:", error.response?.data);
      throw new AppError("Payment initialization failed", 500);
    }
  }

  static async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error("Paystack verification error:", error.response?.data);
      throw new AppError("Payment verification failed", 500);
    }
  }
}