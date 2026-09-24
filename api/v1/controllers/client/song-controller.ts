import Song from "../../models/song-model";
import Topic from "../../models/topic-model";
import { Request, Response } from "express";
import paginationHelper from "../../../../helpers/pagination-helper";
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

   // Support ?topic=slug query param (in addition to /songs/:slugTopic)
   const slugTopic = req.params.slugTopic || (req.query.topic as string | undefined);
   let topic = null;
   if (slugTopic) {
      topic = await Topic.findOne({ slug: slugTopic });
      if(!topic) {
         res.status(404).json({ code: 404, message: "Topic not found" });
         return;
      }
      findQuery.topic_id = topic._id.toString();
   }
   const songs = await Song
      .find(findQuery)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate('singer_id topic_id', 'fullname title')
   res.json({
      code: 200,
      data: {
         songs: songs,
         topic: topic,
         objectPagination: pagination,
         countData: countData
      }
   });
}
//GET /songs/:slugSong
export const detail = async (req: Request, res: Response) => {
  try{
      const slugSong = req.params.slugSong;
      const song = await Song.findOne({ slug: slugSong }).populate('singer_id topic_id', 'fullname title')
      if(!song) {
         res.status(404).json({ code: 404, message: "Song not found" });
         return;
      }
      const relatedSongs = await Song.find({ topic_id: song.topic_id, deleted: false, status: "active", _id: { $ne: song._id } }).limit(5).populate('singer_id topic_id', 'fullname title')
      res.json({
         code: 200,
         data: {
            song: song,
            relatedSongs: relatedSongs
         }
      });
  } catch (error) {
      res.status(500).json({ code: 500, message: "Internal Server Error" });
      return;
  }
}
//PATCH /songs/listen/:id
export const updateListen = async (req: Request, res: Response) => {
  try {
    const songId = req.params.id;
    await Song.updateOne({ _id: songId, deleted: false, status: "active" }, { $inc: { listen: 1 } });
    res.json({ code: 200, message: "Cập nhật lượt nghe thành công" });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
}