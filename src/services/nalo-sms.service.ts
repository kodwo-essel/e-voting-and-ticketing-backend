import axios from "axios";
import { ISMSService, SMSData, SMSResult } from "../sms.interface";

export class NaloSMSService implements ISMSService {
  private readonly baseURL = "https://sms.nalosolutions.com/smsbackend/Resl_Nalo";
  private readonly username = process.env.NALO_USERNAME;
  private readonly password = process.env.NALO_PASSWORD;
  private readonly senderId = process.env.NALO_SENDER_ID;

  async sendSMS(data: SMSData): Promise<SMSResult> {
    try {
      const response = await axios.post(
        `${this.baseURL}/send-message/`,
        {
          username: this.username,
          password: this.password,
          msisdn: data.to,
          message: data.message,
          sender_id: this.senderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: response.data.status === "1701",
        messageId: response.data.job_id,
      };
    } catch (error: any) {
      console.error("Nalo SMS error:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}