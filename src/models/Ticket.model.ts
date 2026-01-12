import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  purchaseId: mongoose.Types.ObjectId;
  ticketTypeId: mongoose.Types.ObjectId;
  ticketNumber: string;
  qrData: string;
  
  // Customer details
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  
  // Status
  isUsed: boolean;
  usedAt?: Date;
  scannedBy?: mongoose.Types.ObjectId;
  
  createdAt: Date;
}

const ticketSchema = new Schema<ITicket>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  purchaseId: { type: Schema.Types.ObjectId, ref: "Purchase", required: true },
  ticketTypeId: { type: Schema.Types.ObjectId, required: true },
  ticketNumber: { type: String, required: true, unique: true },
  qrData: { type: String, required: true },
  
  customerEmail: { type: String, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date },
  scannedBy: { type: Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true
});

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);