import Topic from "../../models/topic-model";
import { Request, Response } from "express";
import createSearchRegex from "../../helpers/search-helper"
//GET /admin/topics
type taskStatus = "active" | "inactive";
interface FindQuery {
    deleted: boolean;
    status?: taskStatus;
    title?: { $regex: RegExp };
}
export const index = async (req: Request, res: Response) => {
    try{
        const findQuery: FindQuery = { deleted: false };
        //search
         if (req.query.keyword && typeof req.query.keyword === "string") {
            const regex = createSearchRegex({ keyword: req.query.keyword });
            findQuery.title = { $regex: regex };
        }
        const topics = await Topic.find(findQuery);
        res.render("admin/pages/topics/index", {
            topics: topics
        });
    }
    catch(err){
        console.error(err);
    }
}