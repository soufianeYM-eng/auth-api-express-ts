import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/dates";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userAgent: { type: String },
  createdAt: { type: Date, required: true, default: Date.now() },
  expiresAt: { type: Date, required: true, default: thirtyDaysFromNow },
});

const SessionModel = mongoose.model<SessionDocument>(
  "Session",
  sessionSchema
);

export default SessionModel;
