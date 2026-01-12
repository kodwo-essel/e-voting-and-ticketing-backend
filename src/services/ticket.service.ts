import { Ticket } from "../models/Ticket.model";
import { Event } from "../models/Event.model";
import { AppError } from "../middleware/error.middleware";

export class TicketService {
  static async getTicketsByPurchase(purchaseId: string) {
    return await Ticket.find({ purchaseId }).populate("eventId", "title venue startDate");
  }

  static async scanTicket(ticketNumber: string, scannerId: string) {
    const ticket = await Ticket.findOne({ ticketNumber }).populate("eventId");
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    if (ticket.isUsed) {
      throw new AppError("Ticket already used", 400);
    }

    // Verify scanner has permission for this event
    const event = await Event.findById(ticket.eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Only organizer or admin can scan tickets
    // This check should be done in the controller with proper role validation

    ticket.isUsed = true;
    ticket.usedAt = new Date();
    ticket.scannedBy = scannerId as any;
    await ticket.save();

    return ticket;
  }

  static async getEventTickets(eventId: string, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return await Ticket.find({ eventId })
      .populate("ticketTypeId")
      .sort({ createdAt: -1 });
  }

  static async getTicketStats(eventId: string, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    const stats = await Ticket.aggregate([
      { $match: { eventId: event._id } },
      {
        $group: {
          _id: "$ticketTypeId",
          total: { $sum: 1 },
          used: { $sum: { $cond: ["$isUsed", 1, 0] } },
          unused: { $sum: { $cond: ["$isUsed", 0, 1] } }
        }
      }
    ]);

    return stats;
  }
}