// @desc create a ticket
// route POST /api/v1/support/create_ticket
// access public

import { NextFunction, Request, Response } from "express";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, deviceId, queryText } = req.body;
  console.log("req body:", req.body);

  if (!userId || !deviceId || !queryText) {
    const error = new Error("All fields are mandatory");
    res.status(400);
    return next(error);
  }
};
