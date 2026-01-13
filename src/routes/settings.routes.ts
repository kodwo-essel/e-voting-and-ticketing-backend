import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { asyncHandler } from "../middleware/async.middleware";

const router = Router();

router.get(
  "/payment-gateway",
  authenticate,
  requireRole(["SUPER_ADMIN"]),
  asyncHandler(SettingsController.getPaymentGateway)
);

router.put(
  "/payment-gateway",
  authenticate,
  requireRole(["SUPER_ADMIN"]),
  asyncHandler(SettingsController.setPaymentGateway)
);

export { router as settingsRoutes };