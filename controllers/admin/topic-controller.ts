import Topic from "../../models/topic-model";
import { Request, Response } from "express";
import createSearchRegex from "../../helpers/search-helper"
import filterStatusHelper from "../../helpers/filter-status-helper";
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
        //filter by status
        if (req.query.status && typeof req.query.status === "string") {
            findQuery.status = req.query.status as taskStatus;
        }
        const filterStatus = filterStatusHelper(req.query, "topic");
        //search
         if (req.query.keyword && typeof req.query.keyword === "string") {
            const regex = createSearchRegex({ keyword: req.query.keyword });
            findQuery.title = { $regex: regex };
        }
        const topics = await Topic.find(findQuery);
        res.render("admin/pages/topics/index", {
            title: "Quản lý chủ đề",
            topics: topics,
            keyword: req.query.keyword || "",
            filterStatus: filterStatus
        });
    }
    catch(err){
        console.error(err);
    }
}