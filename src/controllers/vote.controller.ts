import { Request, Response } from "express";
import { VoteService } from "../services/vote.service";
import { asyncHandler } from "../middleware/error.middleware";

export const initiateVote = asyncHandler(async (req: Request, res: Response) => {
  const eventId = Array.isArray(req.params.eventId) ? req.params.eventId[0] : req.params.eventId;
  const candidateCode = Array.isArray(req.params.candidateCode) ? req.params.candidateCode[0] : req.params.candidateCode;
  const { voteCount, customerEmail, customerName, customerPhone } = req.body;
  
  const result = await VoteService.initiateVote(eventId, candidateCode, voteCount, customerEmail, customerName, customerPhone);
  res.json(result);
});

export const confirmVote = asyncHandler(async (req: Request, res: Response) => {
  const reference = Array.isArray(req.params.reference) ? req.params.reference[0] : req.params.reference;
  
  const result = await VoteService.confirmVote(reference);
  res.json(result);
});

export const getVoteResults = asyncHandler(async (req: Request, res: Response) => {
  const eventId = Array.isArray(req.params.eventId) ? req.params.eventId[0] : req.params.eventId;
  
  const results = await VoteService.getVoteResults(eventId);
  res.json(results);
});