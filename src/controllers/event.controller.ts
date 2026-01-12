import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { asyncHandler } from "../middleware/error.middleware";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await EventService.createEvent(req.body, req.user.id);
  res.status(201).json(event);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.updateEvent(id, req.body, req.user.id, req.user.role);
  res.json(event);
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.getEvent(id);
  res.json(event);
});

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await EventService.getEvents(req.query, req.user?.role, req.user?.id);
  res.json(events);
});

export const submitForReview = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.submitForReview(id, req.user.id);
  res.json(event);
});

export const approveEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.approveEvent(id, req.user.role);
  res.json(event);
});

export const publishEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.publishEvent(id, req.user.id);
  res.json(event);
});

export const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.addCategory(id, req.body, req.user.id);
  res.json(event);
});

export const addCandidate = asyncHandler(async (req: Request, res: Response) => {
  const eventId = Array.isArray(req.params.eventId) ? req.params.eventId[0] : req.params.eventId;
  const categoryId = Array.isArray(req.params.categoryId) ? req.params.categoryId[0] : req.params.categoryId;
  const event = await EventService.addCandidate(eventId, categoryId, req.body, req.user.id);
  res.json(event);
});

export const addTicketType = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await EventService.addTicketType(id, req.body, req.user.id);
  res.json(event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await EventService.deleteEvent(id, req.user.id, req.user.role);
  res.json(result);
});