import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  title?: string;
  description?: string;
  permissions?: string[];
  countPermissions?: number;
  countAccounts?: number;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>({
  title: { type: String },
  description: { type: String },
  permissions: {
    type: [String],
    default: []
  },
  countPermissions: {
    type: Number,
    default: 0
  },
  countAccounts: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});

const Role = mongoose.model<IRole>("Role", roleSchema, "roles");
export default Role;
