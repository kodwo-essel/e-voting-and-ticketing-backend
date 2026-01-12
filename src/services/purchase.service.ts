import { Purchase } from "../models/Purchase.model";
import { Event } from "../models/Event.model";
import { Ticket } from "../models/Ticket.model";
import { PaystackService } from "./paystack.service";
import { AppError } from "../middleware/error.middleware";
import crypto from "crypto";
import { IPurchase } from "../models/Purchase.model";

export class PurchaseService {
  static generateReference(): string {
    return `EV_${Date.now()}_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }

  static generateTicketNumber(): string {
    return `TK${Date.now()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
  }

  static async initializeTicketPurchase(data: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
    userId?: string;
  }) {
    const event = await Event.findById(data.eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.status !== "PUBLISHED" && event.status !== "LIVE") {
      throw new AppError("Event not available for ticket purchase", 400);
    }

    const ticketType = event.ticketTypes?.id(data.ticketTypeId);
    if (!ticketType) {
      throw new AppError("Ticket type not found", 404);
    }

    // Check availability
    const soldTickets = await Purchase.aggregate([
      { $match: { ticketTypeId: ticketType._id, status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$ticketQuantity" } } }
    ]);

    const totalSold = soldTickets[0]?.total || 0;
    if (totalSold + data.quantity > ticketType.quantity) {
      throw new AppError("Not enough tickets available", 400);
    }

    const amount = ticketType.price * data.quantity;
    const reference = this.generateReference();
    
    // Hold tickets for 30.5 minutes (Paystack URL expires in 30 minutes)
    const expiresAt = new Date(Date.now() + 30.5 * 60 * 1000);

    const purchase = await Purchase.create({
      eventId: data.eventId,
      userId: data.userId,
      type: "TICKET",
      paymentReference: reference,
      amount,
      ticketTypeId: data.ticketTypeId,
      ticketQuantity: data.quantity,
      expiresAt,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone
    });

    const paymentData = await PaystackService.initializePayment({
      email: data.customerEmail,
      amount,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      metadata: {
        purchaseId: purchase._id,
        eventId: data.eventId,
        type: "TICKET"
      }
    });

    return {
      purchase,
      paymentUrl: paymentData.authorization_url,
      reference
    };
  }

  static async initializeVotePurchase(data: {
    eventId: string;
    candidateId: string;
    categoryId: string;
    voteCount: number;
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
    userId?: string;
  }) {
    const event = await Event.findById(data.eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.status !== "PUBLISHED" && event.status !== "LIVE") {
      throw new AppError("Event not available for voting", 400);
    }

    if (!event.costPerVote) {
      throw new AppError("Voting not configured for this event", 400);
    }

    // Validate vote limits
    if (event.minVotesPerPurchase && data.voteCount < event.minVotesPerPurchase) {
      throw new AppError(`Minimum ${event.minVotesPerPurchase} votes required`, 400);
    }

    if (event.maxVotesPerPurchase && data.voteCount > event.maxVotesPerPurchase) {
      throw new AppError(`Maximum ${event.maxVotesPerPurchase} votes allowed`, 400);
    }

    const category = event.categories?.id(data.categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const candidate = category.candidates.id(data.candidateId);
    if (!candidate) {
      throw new AppError("Candidate not found", 404);
    }

    const amount = event.costPerVote * data.voteCount;
    const reference = this.generateReference();
    
    // Hold votes for 30.5 minutes
    const expiresAt = new Date(Date.now() + 30.5 * 60 * 1000);

    const purchase = await Purchase.create({
      eventId: data.eventId,
      userId: data.userId,
      type: "VOTE",
      paymentReference: reference,
      amount,
      candidateId: data.candidateId,
      categoryId: data.categoryId,
      voteCount: data.voteCount,
      expiresAt,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone
    });

    const paymentData = await PaystackService.initializePayment({
      email: data.customerEmail,
      amount,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      metadata: {
        purchaseId: purchase._id,
        eventId: data.eventId,
        type: "VOTE"
      }
    });

    return {
      purchase,
      paymentUrl: paymentData.authorization_url,
      reference
    };
  }

  static async verifyPayment(reference: string) {
    const purchase = await Purchase.findOne({ paymentReference: reference });
    if (!purchase) {
      throw new AppError("Purchase not found", 404);
    }

    if (purchase.status === "PAID") {
      return { purchase, message: "Payment already verified" };
    }

    const paymentData = await PaystackService.verifyPayment(reference);
    
    if (paymentData.status !== "success") {
      throw new AppError("Payment verification failed", 400);
    }

    purchase.status = "PAID";
    purchase.paidAt = new Date();
    await purchase.save();

    if (purchase.type === "TICKET") {
      await this.generateTickets(purchase);
    } else if (purchase.type === "VOTE") {
      await this.addVotes(purchase);
    }

    return { purchase, paymentData };
  }

  static async generateTickets(purchase: IPurchase) {
    const tickets = [];
    
    for (let i = 0; i < purchase.ticketQuantity!; i++) {
      const ticketNumber = this.generateTicketNumber();
      const qrData = JSON.stringify({
        eventId: purchase.eventId,
        ticketNumber,
        purchaseId: purchase._id,
        customerEmail: purchase.customerEmail
      });

      const ticket = await Ticket.create({
        eventId: purchase.eventId,
        purchaseId: purchase._id,
        ticketTypeId: purchase.ticketTypeId,
        ticketNumber,
        qrData,
        customerEmail: purchase.customerEmail,
        customerName: purchase.customerName,
        customerPhone: purchase.customerPhone
      });

      tickets.push(ticket);
    }

    purchase.ticketNumbers = tickets.map(t => t.ticketNumber);
    await purchase.save();

    return tickets;
  }

  static async addVotes(purchase: IPurchase) {
    const event = await Event.findById(purchase.eventId);
    if (!event) return;

    const category = event.categories?.id(purchase.categoryId);
    if (!category) return;

    const candidate = category.candidates.id(purchase.candidateId);
    if (!candidate) return;

    candidate.votes = (candidate.votes || 0) + purchase.voteCount!;
    await event.save();
  }

  static async getPurchaseHistory(userId: string) {
    return await Purchase.find({ userId })
      .populate("eventId", "title type")
      .sort({ createdAt: -1 });
  }

  static async getEventPurchases(eventId: string, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId.toString() !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return await Purchase.find({ eventId, status: "PAID" })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
  }
}