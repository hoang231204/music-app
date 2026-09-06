import Topic from "../../models/topic-model";
import { Request, Response } from "express";
import paginationHelper from "../../helpers/pagination-helper";
import createSearchRegex from "../../helpers/search-helper"
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
        //pagination
        const countData: number = await Topic.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query, countData);
        const limit = pagination.limitPage;
        const skip = pagination.skipPage;
        const topics = await Topic.find(findQuery).limit(limit).skip(skip);
        res.render("client/pages/topics/index", {
            pageTitle: "Chủ đề âm nhạc",
            topics: topics,
            objectPagination: pagination,
            countData: countData
        });
    }
    catch(err){
        console.error(err);
    }
}