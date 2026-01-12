import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  initializeTicketPurchase,
  initializeVotePurchase,
  verifyPayment,
  getPurchaseHistory,
  getEventPurchases,
  paystackWebhook
} from "../controllers/purchase.controller";

const router = Router();

// Public routes
router.post("/tickets/initialize", initializeTicketPurchase);
router.post("/votes/initialize", initializeVotePurchase);
router.get("/verify/:reference", verifyPayment);
router.post("/webhook/paystack", paystackWebhook);

// Authenticated routes
router.get("/history", authenticate, getPurchaseHistory);
router.get("/events/:eventId", authenticate, requireRole("ORGANIZER", "ADMIN", "SUPER_ADMIN"), getEventPurchases);

export default router;