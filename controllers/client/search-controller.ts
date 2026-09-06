import { Request, Response } from "express";
import createSearchRegex from "../../helpers/search-helper"
import Song from "../../models/song-model";
import Topic from "../../models/topic-model";
import Singer from "../../models/singer-model";
type taskStatus = "active" | "inactive";
interface FindQuery1 {
    deleted: boolean;
    status?: taskStatus;
    title?: { $regex: RegExp };
}
interface FindQuery2 {
    deleted: boolean;
    status?: taskStatus;
    fullname?: { $regex: RegExp };
}
export const index = async (req: Request, res: Response) => {
    const findQuery1: FindQuery1 = { deleted: false };
    const findQuery2: FindQuery2 = { deleted: false };
    //search
    if (req.query.keyword && typeof req.query.keyword === "string") {
    const regex = createSearchRegex({ keyword: req.query.keyword });
    findQuery1.title = { $regex: regex };
    findQuery2.fullname = { $regex: regex };
    }
    const [songs, singers, topics] = await Promise.all([
    Song.find(findQuery1).sort({ listen: -1, like: -1 }).limit(8).populate("singer_id topic_id", "fullname title").lean(),
    Singer.find(findQuery2).limit(8).lean(),
    Topic.find(findQuery1).limit(8).lean()
    ]);
    res.render("client/pages/search/index", {
        pageTitle: "Tìm kiếm",
        keyword: req.query.keyword || "",
        songs,
        singers,
        topics
    });
}