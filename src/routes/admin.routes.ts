import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { createAdmin, approveOrganizer } from "../controllers/admin.controller";

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


export default router;
