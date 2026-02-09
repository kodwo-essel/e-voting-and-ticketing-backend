export interface SMSData {
  to: string;
  message: string;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ISMSService {
  sendSMS(data: SMSData): Promise<SMSResult>;
}