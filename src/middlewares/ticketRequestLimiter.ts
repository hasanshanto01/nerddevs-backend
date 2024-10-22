import { NextFunction, Request, Response } from "express";
import { ticketModel } from "../models/ticketModel";

export const ticketRequestLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | void> => {
  const { userId } = req?.body;

  if (!userId) {
    const error = new Error("User ID is required");
    res.status(400);
    return next(error);
  }

  const lastTicket = await ticketModel.findOne({ userId }).sort({ date: -1 });

  if (lastTicket) {
    const currentTime = new Date();
    const lastTicketTime = lastTicket?.date;
    const timeDiff = (currentTime?.getTime() - lastTicketTime) / (1000 * 60);

    if (timeDiff < 30) {
      return res.status(409).json({
        message:
          "You have already placed a support ticket. Please wait at least one hour before sending another request",
      });
    }
  }

  next();
};
