import mongoose, { Document, Schema } from "mongoose";

interface ITicket extends Document {
  userId: string;
  date: Date;
  deviceId: string;
  queryText: string;
}

const ticketSchema = new Schema<ITicket>(
  {
    userId: { type: String, required: [true, "User ID is required"] },
    date: { type: Date },
    deviceId: { type: String, required: [true, "Device ID is required"] },
    queryText: { type: String, required: [true, "Query text is required"] },
  },
  { timestamps: true }
);

export const ticketModel =
  mongoose.models.tickets || mongoose.model<ITicket>("tickets", ticketSchema);
