// @desc register a user
// route POST /api/v1/user/register
// access public

import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../models/userModel";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | void> => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if (!firstName || !lastName || !email || !mobile || !password) {
    const error = new Error("All fields are mandatory");
    res.status(400);
    return next(error);
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    res.status(400);
    return next(error);
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      active: false,
    });

    const activationToken = jwt.sign(
      { _id: newUser._id, email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message:
        "Registration successful. Please check your email to activate your account.",
      token: `${process.env.BASE_URL}/api/v1/user/activation?token=${activationToken}`,
    });
  } catch (err) {
    console.error("Error registering user:", err);

    if (err instanceof Error && err.name === "ValidationError") {
      res.status(400);
      return next(err);
    }

    const error = new Error("Internal server error");
    res.status(500);
    return next(error);
  }
};

// @desc activate a user
// route GET /api/v1/user/activation
// access public

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | void> => {
  const { token } = req.query;

  if (!token) {
    const error = new Error("Activation token is required");
    res.status(400);
    return next(error);
  }

  try {
    const decode = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await userModel.findOne({ email: decode.email });

    if (!user) {
      const error = new Error("User not found");
      res.status(400);
      return next(error);
    }

    if (user.active) {
      const error = new Error("Account is already activated");
      res.status(400);
      return next(error);
    }

    const updatedUser = await userModel.updateOne(
      { email: decode.email },
      { active: true }
    );

    if (updatedUser.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Account activated successfully!" });
    }
  } catch (err) {
    console.error("Error activating account:", err);

    if (err instanceof Error && err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid activation token" });
    } else if (err instanceof Error && err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Activation token has expired" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

// @desc login a user
// route POST /api/v1/user/login
// access public

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("All fields are mandatory");
    res.status(400);
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email or password");
      res.status(400);
      return next(error);
    }

    if (!user.active) {
      const error = new Error(
        "Account is not activated. Please activate your account"
      );
      res.status(401);
      return next(error);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      const error = new Error("Invalid email or password");
      res.status(401);
      return next(error);
    }

    const token = jwt.sign(
      { _id: user._id, email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Login successful.",
      token,
    });
  } catch (err) {
    const error = new Error("Internal server error");
    res.status(500);
    return next(error);
  }
};
