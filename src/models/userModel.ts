import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  active: boolean;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[0-9]{10,15}$/,
        "Please enter a valid mobile number with 10 to 15 digits",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    active: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model<IUser>("users", userSchema);
