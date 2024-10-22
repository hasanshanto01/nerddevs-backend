// @desc create a ticket
// route POST /api/v1/support/create_ticket
// access public

import { NextFunction, Request, Response } from "express";
import { ticketModel } from "../models/ticketModel";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | void> => {
  const { userId, deviceId, queryText } = req.body;

  if (!userId || !deviceId || !queryText) {
    const error = new Error("All fields are mandatory");
    res.status(400);
    return next(error);
  }

  try {
    const newTicket = await ticketModel.create({
      userId,
      date: new Date(),
      deviceId,
      queryText,
    });

    return res.status(201).json({ data: { _id: newTicket._id } });
  } catch (err) {
    console.error("Error creating ticket:", err);

    if (err instanceof Error && err.name === "ValidationError") {
      res.status(400);
      return next(err);
    }
    const error = new Error("Internal server error");
    res.status(500);
    return next(error);
  }
};
