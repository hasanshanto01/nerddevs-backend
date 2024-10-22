import { NextFunction, Request, Response } from "express";
import { constants } from "../utils/constants";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : constants.SERVER_ERROR;

  switch (statusCode) {
    case constants.BAD_REQUEST:
      res.json({ title: "Bad Request", message: err.message });
      break;
    case constants.UNAUTHORIZED:
      res.json({ title: "Unauthorized", message: err.message });
      break;
    case constants.FORBIDDEN:
      res.json({ title: "Forbidden", message: err.message });
      break;
    case constants.NOT_FOUND:
      res.json({ title: "Not Found", message: err.message });
      break;
    case constants.SERVER_ERROR:
      res.json({ title: "Internal Server Error", message: err.message });
      break;

    default:
      console.log("No error, all good!");
      break;
  }
};
