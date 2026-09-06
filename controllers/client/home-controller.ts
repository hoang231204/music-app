import { Request, Response } from "express";
import Song from "../../models/song-model";
import Topic from "../../models/topic-model";
import Singer from "../../models/singer-model";
export const index = async (req: Request, res: Response) => {
   try{
    const [
        newReleases, 
        featuredTopics, 
        featuredSingers, 
        trendingSongs
    ] = await Promise.all([
        Song.find({ status: "active" }).sort({ createdAt: -1 }).limit(8).populate("singer_id topic_id", "fullname title").lean(),
        Topic.find({ status: "active", isFeatured: true }).limit(5).lean(),
        Singer.find({ status: "active", isFeatured: true }).limit(5).lean(),
        Song.find({ status: "active" }).sort({ listen: -1, likes: -1 }).limit(8).populate("singer_id topic_id", "fullname title").lean()
    ]);
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        newReleases,
        featuredTopics,
        featuredSingers,
        trendingSongs
    });
   }
    catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    
    }}