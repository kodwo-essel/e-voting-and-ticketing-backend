import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  createEvent,
  updateEvent,
  getEvent,
  getEvents,
  submitForReview,
  approveEvent,
  publishEvent,
  addCategory,
  addCandidate,
  addTicketType,
  deleteEvent
} from "../controllers/event.controller";

const router = Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvent);

// Organizer routes
router.post("/", authenticate, requireRole("ORGANIZER", "ADMIN", "SUPER_ADMIN"), createEvent);
router.put("/:id", authenticate, requireRole("ORGANIZER", "ADMIN", "SUPER_ADMIN"), updateEvent);
router.patch("/:id/submit", authenticate, requireRole("ORGANIZER"), submitForReview);
router.patch("/:id/publish", authenticate, requireRole("ORGANIZER"), publishEvent);
router.post("/:id/categories", authenticate, requireRole("ORGANIZER"), addCategory);
router.post("/:eventId/categories/:categoryId/candidates", authenticate, requireRole("ORGANIZER"), addCandidate);
router.post("/:id/ticket-types", authenticate, requireRole("ORGANIZER"), addTicketType);
router.delete("/:id", authenticate, deleteEvent);

// Admin routes
router.patch("/:id/approve", authenticate, requireRole("ADMIN", "SUPER_ADMIN"), approveEvent);

export default router;