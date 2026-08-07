import mongoose, { Document, Schema } from "mongoose";
import slug from "slugify";
export interface ISinger extends Document {
  fullname?: string;
  avatar?: string;
  status?: string;
  slug?: string;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const singerSchema = new Schema<ISinger>({
  fullname: { type: String },
  avatar: { type: String },
  status: { type: String },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});

const Singer = mongoose.model<ISinger>("Singer", singerSchema, "singers");
export default Singer;
