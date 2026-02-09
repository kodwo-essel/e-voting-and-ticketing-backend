export interface PaymentInitializationData {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  metadata?: any;
}

export interface PaymentInitializationResult {
  authorization_url: string;
  reference: string;
}

export interface PaymentVerificationResult {
  status: 'success' | 'failed';
  amount: number;
  currency: string;
  reference: string;
}

export interface WebhookResult {
  isValid: boolean;
  reference?: string;
  status?: string;
}

export interface IPaymentGateway {
  initializePayment(data: PaymentInitializationData): Promise<PaymentInitializationResult>;
  verifyPayment(reference: string): Promise<PaymentVerificationResult>;
  handleWebhook(req: any): Promise<WebhookResult>;
}

export interface IPaymentGatewayStatic {
  initializePayment(data: PaymentInitializationData): Promise<PaymentInitializationResult>;
  verifyPayment(reference: string): Promise<PaymentVerificationResult>;
  handleWebhook(req: any): Promise<WebhookResult>;
}