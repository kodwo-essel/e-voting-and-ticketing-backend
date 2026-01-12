import { Request, Response } from "express";
import { PurchaseService } from "../services/purchase.service";
import { asyncHandler } from "../middleware/error.middleware";
import crypto from "crypto";

export const initializeTicketPurchase = asyncHandler(async (req: Request, res: Response) => {
  const result = await PurchaseService.initializeTicketPurchase({
    ...req.body,
    userId: req.user?.id
  });
  res.status(201).json(result);
});

export const initializeVotePurchase = asyncHandler(async (req: Request, res: Response) => {
  const result = await PurchaseService.initializeVotePurchase({
    ...req.body,
    userId: req.user?.id
  });
  res.status(201).json(result);
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { reference } = req.params;
  const result = await PurchaseService.verifyPayment(reference);
  res.json(result);
});

export const paystackWebhook = asyncHandler(async (req: Request, res: Response) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;
  
  if (event.event === 'charge.success') {
    await PurchaseService.verifyPayment(event.data.reference);
  }

  res.status(200).send('OK');
});

export const getPurchaseHistory = asyncHandler(async (req: Request, res: Response) => {
  const purchases = await PurchaseService.getPurchaseHistory(req.user.id);
  res.json(purchases);
});

export const getEventPurchases = asyncHandler(async (req: Request, res: Response) => {
  const eventId = Array.isArray(req.params.eventId) ? req.params.eventId[0] : req.params.eventId;
  const purchases = await PurchaseService.getEventPurchases(eventId, req.user.id);
  res.json(purchases);
});