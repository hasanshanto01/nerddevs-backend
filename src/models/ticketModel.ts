import mongoose, { Document, Schema } from "mongoose";

interface ITicket extends Document {
  userId: string;
  date: Date;
  deviceId: string;
  queryText: string;
}

const ticketSchema = new Schema<ITicket>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true,
    },
    date: { type: Date, required: true },
    deviceId: {
      type: String,
      required: [true, "Device ID is required"],
      trim: true,
    },
    queryText: {
      type: String,
      required: [true, "Query text is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const ticketModel =
  mongoose.models.tickets || mongoose.model<ITicket>("tickets", ticketSchema);
