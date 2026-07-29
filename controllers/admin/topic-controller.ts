import Topic from "../../models/topic-model";
import { Request, Response } from "express";
export const index = async (req: Request, res: Response) => {
    try{
        const topics = await Topic.find({deleted: false});
        res.render("admin/pages/topics/index", {
            topics: topics
        });
    }
    catch(err){
        console.error(err);
    }
}