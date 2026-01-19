import axios from "axios";
import { ISMSService, SMSData, SMSResult } from "../sms.interface";

export class TermiiSMSService implements ISMSService {
  private readonly baseURL = "https://api.ng.termii.com/api";
  private readonly apiKey = process.env.TERMII_API_KEY;
  private readonly senderId = process.env.TERMII_SENDER_ID;

  async sendSMS(data: SMSData): Promise<SMSResult> {
    try {
      const response = await axios.post(`${this.baseURL}/sms/send`, {
        to: data.to,
        from: this.senderId,
        sms: data.message,
        type: "plain",
        api_key: this.apiKey,
        channel: "generic",
      });

      return {
        success: true,
        messageId: response.data.message_id,
      };
    } catch (error: any) {
      console.error("Termii SMS error:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}