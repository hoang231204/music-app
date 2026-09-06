import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song-model";
import Song from "../../models/song-model";

export const index = async (req: Request, res: Response) => {
  const favoriteRecords = await FavoriteSong.find({ user_id: req.user?._id.toString() }).sort({ createdAt: -1 }).lean();
  const songIds = favoriteRecords.map((favorite) => favorite.song_id);
  const songs = await Song.find({ _id: { $in: songIds }, deleted: false }).populate("singer_id topic_id", "fullname title").lean();
  const songsById = new Map(songs.map((song) => [song._id.toString(), song]));
  const orderedSongs = songIds
    .map((songId) => songsById.get(songId))
    .filter((song): song is NonNullable<typeof song> => Boolean(song))
    .map((song) => ({ ...song, isFavorite: true }));

  res.render("client/pages/favorites/index", {
    pageTitle: "Bài hát yêu thích",
    songs: orderedSongs,
  });
};

export const toggleFavorite = async (req: Request, res: Response) => {
  const accountId = req.user?._id.toString();
  const songId = req.params.songId as string;
  if (!accountId) return res.status(401).json({ code: 401, message: "Vui lòng đăng nhập để thực hiện chức năng này!" });

  const song = await Song.findOne({ _id: songId, deleted: false, status: "active" });
  if (!song) return res.status(404).json({ code: 404, message: "Không tìm thấy bài hát!" });

  const existing = await FavoriteSong.findOne({ user_id: accountId, song_id: songId });
  let isFavorite: boolean;
  let message: string;
  if (existing) {
    await existing.deleteOne();
    song.like = Math.max(0, song.like - 1);
    isFavorite = false;
    message = "Đã xóa bài hát khỏi danh sách yêu thích";
  } else {
    await FavoriteSong.create({ user_id: accountId, song_id: songId });
    song.like += 1;
    isFavorite = true;
    message = "Đã thêm bài hát vào danh sách yêu thích";
  }
  await song.save();
  req.flash("success", message);
  return res.json({ code: 200, isFavorite, likes: song.like, message });
};