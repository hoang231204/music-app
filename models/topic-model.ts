import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";
export interface ITopic extends Document {
  title?: string;
  avatar?: string;
  description?: string;
  status?: string;
  slug?: string;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>({
  title: { type: String },
  avatar: { type: String },
  description: { type: String },
  status: { type: String },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});

const Topic = mongoose.model<ITopic>("Topic", topicSchema, "topics");
export default Topic;