import mongoose, { Document, Schema } from "mongoose";
import { slugPlugin } from "../helpers/slugify";
export interface ISinger extends Document {
  fullname?: string;
  avatar?: string;
  status?: string;
  slug?: string;
  isFeatured?: boolean;
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
  isFeatured: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});
singerSchema.plugin(slugPlugin, { from: "fullname", to: "slug" });
singerSchema.index({ status: 1, isFeatured: 1 });
const Singer = mongoose.model<ISinger>("Singer", singerSchema, "singers");
export default Singer;
