import { Router } from "express";
import { handleUSSDRequest } from "../controllers/ussd.controller";

const router = Router();

// USSD endpoint - no authentication required
router.post("/", handleUSSDRequest);

export default router;