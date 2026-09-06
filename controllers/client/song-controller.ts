import Song from "../../models/song-model";
import Topic from "../../models/topic-model";
import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination-helper";
//GET /topics/:slugTopic
type taskStatus = "active" | "inactive";
interface FindQuery {
    deleted: boolean;
    status?: taskStatus;
    title?: { $regex: RegExp };
    topic_id?: string;
}
export const index = async (req: Request, res: Response) => {
   const findQuery: FindQuery = { deleted: false, status: "active" };
   //sort
   const sort: Record<string, 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'> = {};
   if (req.query.sortBy && req.query.sortType) {
      const sortBy = req.query.sortBy as string;
      const sortType = req.query.sortType as 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
      sort[sortBy] = sortType;
   }
   //pagination
   const countData: number = await Song.find(findQuery).countDocuments();
   const pagination = paginationHelper(req.query, countData);
   const limit = pagination.limitPage;
   const skip = pagination.skipPage;

   const slugTopic = req.params.slugTopic;
   let topic = null;
   if (slugTopic) {
      topic = await Topic.findOne({ slug: slugTopic });
      if(!topic) {
         return res.redirect("/404");
      }
      findQuery.topic_id = topic._id.toString();
   }
   const songs = await Song
      .find(findQuery)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate('singer_id topic_id', 'fullname title')
   res.render("client/pages/songs/index", {
      pageTitle: topic ? `Bài hát chủ đề ${topic.title}` : "Tất cả bài hát",
      songs: songs,
      topic: topic,
      objectPagination: pagination,
      countData: countData
   });
}
//GET /songs/:slugSong
export const detail = async (req: Request, res: Response) => {
  try{
      const slugSong = req.params.slugSong;
      const song = await Song.findOne({ slug: slugSong }).populate('singer_id topic_id', 'fullname title')
      if(!song) {
         return res.redirect("/404");
      }
      const relatedSongs = await Song.find({ topic_id: song.topic_id, deleted: false, status: "active", _id: { $ne: song._id } }).limit(5).populate('singer_id topic_id', 'fullname title')
      res.render("client/pages/songs/detail", {
         pageTitle: `Bài hát ${song.title}`,
         song: song,
         relatedSongs: relatedSongs
      });
  } catch (error) {
      return res.redirect("/404");
  }
}