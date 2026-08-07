import mongoose, { Document, Schema } from "mongoose";
import slug from "slugify";
export interface ISong extends Document {
  title?: string;
  avatar?: string;
  description?: string;
  singer_id?: string;
  topic_id?: string;
  lyrics?: string;
  audio?: string;
  listen: number;
  like: number;
  status?: string;
  slug?: string;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<ISong>({
  title: { type: String },
  avatar: { type: String },
  description: { type: String },
  singer_id: {
    type: String,
    ref: "Singer",
    default: null,
  },
  topic_id: {
    type: String,
    ref: "Topic",
    default: null,
  },
  lyrics: { type: String },
  audio: { type: String },
  listen: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  status: { type: String },
  slug: { type: String , slug: "title", index: true},
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});

const Song = mongoose.model<ISong>("Song", songSchema, "songs");
export default Song;
