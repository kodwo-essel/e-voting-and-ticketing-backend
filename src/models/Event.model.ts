import mongoose, { Document, Schema } from "mongoose";

export interface ICandidate {
  _id?: mongoose.Types.ObjectId;
  name: string;
  imageUrl?: string;
  description?: string;
  code: string;
  votes?: number;
}

export interface ICategory {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  candidates: ICandidate[];
}

export interface ITicketType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  sold?: number;
}

export interface IEvent extends Document {
  organizerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "VOTING" | "TICKETING";
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PUBLISHED" | "LIVE" | "PAUSED" | "ENDED" | "CANCELLED" | "ARCHIVED";
  eventCode: string;
  imageUrl?: string;
  
  // Dates
  startDate: Date;
  endDate: Date;
  nominationStartDate?: Date;
  nominationEndDate?: Date;
  votingStartDate?: Date;
  votingEndDate?: Date;
  ticketSaleStartDate?: Date;
  ticketSaleEndDate?: Date;
  
  // Location
  venue?: string;
  location?: string;
  
  // Visibility
  isPublic: boolean;
  
  // Voting specific
  costPerVote?: number;
  minVotesPerPurchase?: number;
  maxVotesPerPurchase?: number;
  allowPublicNominations?: boolean;
  categories?: ICategory[];
  
  // Ticketing specific
  ticketTypes?: ITicketType[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>({
  name: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
  code: { type: String, required: true, unique: true },
  votes: { type: Number, default: 0 }
});

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  candidates: [candidateSchema]
});

const ticketTypeSchema = new Schema<ITicketType>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sold: { type: Number, default: 0 }
});

const eventSchema = new Schema<IEvent>({
  organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["VOTING", "TICKETING"], required: true },
  status: { 
    type: String, 
    enum: ["DRAFT", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "LIVE", "PAUSED", "ENDED", "CANCELLED", "ARCHIVED"],
    default: "DRAFT"
  },
  eventCode: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  nominationStartDate: { type: Date },
  nominationEndDate: { type: Date },
  votingStartDate: { type: Date },
  votingEndDate: { type: Date },
  ticketSaleStartDate: { type: Date },
  ticketSaleEndDate: { type: Date },
  
  venue: { type: String },
  location: { type: String },
  isPublic: { type: Boolean, default: true },
  
  costPerVote: { type: Number },
  minVotesPerPurchase: { type: Number },
  maxVotesPerPurchase: { type: Number },
  allowPublicNominations: { type: Boolean, default: false },
  categories: [categorySchema],
  
  ticketTypes: [ticketTypeSchema]
}, {
  timestamps: true
});

export const Event = mongoose.model<IEvent>("Event", eventSchema);