import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { createAdmin, approveOrganizer } from "../controllers/admin.controller";
import { updateSetting, getSetting, getAllSettings } from "../controllers/settings.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  requireRole("SUPER_ADMIN"),
  createAdmin
);

router.patch(
  "/approve-organizer/:id",
  authenticate,
  requireRole("ADMIN", "SUPER_ADMIN"),
  approveOrganizer
);

// Settings routes - Super Admin only
router.put(
  "/settings",
  authenticate,
  requireRole("SUPER_ADMIN"),
  updateSetting
);

router.get(
  "/settings/:key",
  authenticate,
  requireRole("SUPER_ADMIN"),
  getSetting
);

router.get(
  "/settings",
  authenticate,
  requireRole("SUPER_ADMIN"),
  getAllSettings
);

export default router;
