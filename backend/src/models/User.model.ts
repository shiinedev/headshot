import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  credits: number;
  isActive: boolean;
  isEmailVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userModel = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  credits: {
    type: Number,
    default: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
},{
    timestamps: true
});

export const User = mongoose.model<IUser>("User", userModel);
