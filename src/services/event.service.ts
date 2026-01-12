import { Event, IEvent } from "../models/Event.model";
import { AppError } from "../middleware/error.middleware";
import crypto from "crypto";

export class EventService {
  static generateEventCode(): string {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  static generateCandidateCode(): string {
    return crypto.randomBytes(2).toString("hex").toUpperCase();
  }

  static async createEvent(eventData: any, organizerId: string) {
    const eventCode = this.generateEventCode();
    
    const event = await Event.create({
      ...eventData,
      organizerId,
      eventCode,
      status: "DRAFT"
    });

    return event;
  }

  static async updateEvent(eventId: string, updateData: any, organizerId: string, userRole: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Permission check
    if (userRole === "ORGANIZER" && event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    // Prevent certain updates based on status
    if (event.status === "LIVE" && updateData.status !== "PAUSED") {
      throw new AppError("Cannot modify live event", 400);
    }

    Object.assign(event, updateData);
    await event.save();
    return event;
  }

  static async getEvent(eventId: string) {
    const event = await Event.findById(eventId).populate("organizerId", "fullName email");
    if (!event) {
      throw new AppError("Event not found", 404);
    }
    return event;
  }

  static async getEvents(filters: any = {}, userRole?: string, userId?: string) {
    let query: any = {};

    // Role-based filtering
    if (userRole === "ORGANIZER") {
      query.organizerId = userId;
    } else if (!userRole || userRole === "PUBLIC") {
      query.status = { $in: ["PUBLISHED", "LIVE"] };
      query.isPublic = true;
    }

    // Apply additional filters
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    return await Event.find(query).populate("organizerId", "fullName email").sort({ createdAt: -1 });
  }

  static async submitForReview(eventId: string, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError("Only draft events can be submitted for review", 400);
    }

    event.status = "PENDING_REVIEW";
    await event.save();
    return event;
  }

  static async approveEvent(eventId: string, userRole: string) {
    if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new AppError("Unauthorized", 403);
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.status !== "PENDING_REVIEW") {
      throw new AppError("Only pending events can be approved", 400);
    }

    event.status = "APPROVED";
    await event.save();
    return event;
  }

  static async publishEvent(eventId: string, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "APPROVED") {
      throw new AppError("Only approved events can be published", 400);
    }

    event.status = "PUBLISHED";
    await event.save();
    return event;
  }

  static async addCategory(eventId: string, categoryData: any, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.type !== "VOTING") {
      throw new AppError("Categories can only be added to voting events", 400);
    }

    event.categories = event.categories || [];
    event.categories.push(categoryData);
    await event.save();
    return event;
  }

  static async addCandidate(eventId: string, categoryId: string, candidateData: any, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    const category = event.categories?.id(categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const candidateCode = this.generateCandidateCode();
    category.candidates.push({
      ...candidateData,
      code: candidateCode
    });

    await event.save();
    return event;
  }

  static async addTicketType(eventId: string, ticketData: any, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.type !== "TICKETING") {
      throw new AppError("Ticket types can only be added to ticketing events", 400);
    }

    event.ticketTypes = event.ticketTypes || [];
    event.ticketTypes.push(ticketData);
    await event.save();
    return event;
  }

  static async deleteEvent(eventId: string, organizerId: string, userRole: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Permission check
    if (userRole === "ORGANIZER" && event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (["LIVE", "ENDED"].includes(event.status)) {
      throw new AppError("Cannot delete live or ended events", 400);
    }

    await Event.findByIdAndDelete(eventId);
    return { message: "Event deleted successfully" };
  }
}