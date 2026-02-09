import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { initiateVote, confirmVote, getVoteResults } from "../controllers/vote.controller";

const router = Router();

// Voting routes
router.post("/events/:eventId/vote/:candidateCode", initiateVote);
router.get("/events/:eventId/results", getVoteResults);

export default router;