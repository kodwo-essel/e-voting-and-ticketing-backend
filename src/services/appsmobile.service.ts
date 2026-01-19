import axios from "axios";
import crypto from "crypto";
import { AppError } from "../middleware/error.middleware";
import { IPaymentGateway, PaymentInitializationData, PaymentInitializationResult, PaymentVerificationResult, WebhookResult } from "../payment-gateway.interface";

export class AppsMobileService implements IPaymentGateway {
  private readonly baseURL = "https://payments.anmgw.com";
  private readonly clientId = process.env.APPS_MOBILE_CLIENT_ID;
  private readonly clientSecret = process.env.APPS_MOBILE_CLIENT_SECRET;
  private readonly serviceId = process.env.APPS_MOBILE_SERVICE_ID;

  private generateSignature(payload: string): string {
    return crypto.createHmac('sha256', this.clientSecret!).update(payload).digest('hex');
  }

  private getAuthHeader(payload: string): string {
    const signature = this.generateSignature(payload);
    return `${this.clientId}:${signature}`;
  }

  async initializePayment(data: PaymentInitializationData): Promise<PaymentInitializationResult> {
    try {
      const payload = {
        amount: data.amount.toFixed(2),
        callback_url: data.callback_url,
        exttrid: data.reference,
        reference: "EaseVote Payment",
        service_id: this.serviceId,
        nickname: "EaseVote",
        landing_page: `${process.env.FRONTEND_URL}/payment/success`,
        ts: new Date().toISOString().replace('T', ' ').substring(0, 19),
        payment_mode: "CRM"
      };

      const payloadString = JSON.stringify(payload);
      
      const response = await axios.post(
        `${this.baseURL}/third_party_request`,
        payload,
        {
          headers: {
            "Authorization": this.getAuthHeader(payloadString),
            "Content-Type": "application/json",
          },
        }
      );

      return {
        authorization_url: response.data.redirect_url,
        reference: data.reference,
      };
    } catch (error: any) {
      console.error("Apps&Mobile initialization error:", error.response?.data);
      throw new AppError("Payment initialization failed", 500);
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    try {
      const payload = {
        exttrid: reference,
        trans_type: "TSC",
        service_id: this.serviceId
      };

      const payloadString = JSON.stringify(payload);
      
      const response = await axios.post(
        `${this.baseURL}/checkTransaction`,
        payload,
        {
          headers: {
            "Authorization": this.getAuthHeader(payloadString),
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      const isSuccess = data.trans_status?.startsWith('000');
      
      return {
        status: isSuccess ? "success" : "failed",
        amount: 0, // Amount not returned in verification
        currency: "GHS",
        reference: data.trans_ref,
      };
    } catch (error: any) {
      console.error("Apps&Mobile verification error:", error.response?.data);
      throw new AppError("Payment verification failed", 500);
    }
  }

  async handleWebhook(req: any): Promise<WebhookResult> {
    // Apps&Mobile sends callback to callback_url with transaction status
    const data = req.body;
    
    if (data.trans_status) {
      const isSuccess = data.trans_status.startsWith('000');
      
      return {
        isValid: true,
        reference: data.trans_ref,
        status: isSuccess ? "success" : "failed"
      };
    }

    return { isValid: false };
  }
}