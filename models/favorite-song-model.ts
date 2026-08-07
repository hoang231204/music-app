import mongoose, { Document, Schema } from "mongoose";

export interface IFavoriteSong extends Document {
  user_id: string;
  song_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSongSchema = new Schema<IFavoriteSong>({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  song_id: {
    type: String,
    ref: "Song",
    required: true,
  },
}, {
  timestamps: true,
});

const FavoriteSong = mongoose.model<IFavoriteSong>("FavoriteSong", favoriteSongSchema, "favorite-songs");
export default FavoriteSong;
