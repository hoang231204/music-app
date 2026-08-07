import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullname?: string;
  email?: string;
  password?: string;
  avatar?: string;
  phone?: string;
  status: "active" | "inactive";
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  fullname: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  avatar: { type: String },
  phone: { type: String, unique: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>("User", userSchema, "users");
export default User;
