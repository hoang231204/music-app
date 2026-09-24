import Topic from "../../models/topic-model";
import { Request, Response } from "express";
import createSearchRegex from "../../../../helpers/search-helper"
import filterStatusHelper from "../../../../helpers/filter-status-helper";
import paginationHelper from "../../../../helpers/pagination-helper";
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
        //sort
        const sort: Record<string, 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'> = {};
        if (req.query.sortBy && req.query.sortType) {
            const sortBy = req.query.sortBy as string;
            const sortType = req.query.sortType as 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
            sort[sortBy] = sortType;
        }
        //pagination
        const countData: number = await Topic.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query, countData);
        const limit = pagination.limitPage;
        const skip = pagination.skipPage;
        const topics = await Topic.find(findQuery).sort(sort).limit(limit).skip(skip);
        res.json({
            code: 200,
            data: {
                topics: topics,
                keyword: req.query.keyword || "",
                filterStatus: filterStatus,
                pagination: pagination,
                countData: countData
            }
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//GET /admin/topics/edit
export const edit = async (req: Request, res: Response)=>{
    try{
        const topicId = req.params.id;
        const topic = await Topic.findOne({_id: topicId});
        if(!topic){
            return res.status(404).json({ code: 404, message: "Không tìm thấy chủ đề" });
        }
        res.json({ code: 200, data: topic });
    }
    catch(err){
        console.log(err)
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//PATCH /admin/topics/edit
export const editPatch = async (req: Request, res: Response)=>{
    try{
        const topicId = req.params.id;
        await Topic.updateOne({_id: topicId}, req.body);
        res.json({ code: 200, message: "Cập nhật thành công" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//GET /admin/topics/create
export const create = async (req: Request, res: Response)=>{
    try{
        res.json({ code: 200, message: "Form tạo chủ đề mới" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//POST /admin/topics/create
export const createPost = async (req: Request, res: Response)=>{
    try{
        const newTopic = new Topic(req.body);
        await newTopic.save();
        res.json({ code: 200, message: "Tạo chủ đề thành công" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//PATCH /admin/topics/change-multi
export const changeMulti = async (req: Request, res: Response)=>{
    try{
        const type = req.body.type;
        const idschecked = req.body.ids;
        const ids = idschecked.split(",");
        if(type === "delete"){
            await Topic.updateMany({_id: {$in: ids}}, {deleted: true});
        }
        else if(type === "active" || type === "inactive"){
            await Topic.updateMany({_id: {$in: ids}}, {status: type});
        }
        res.json({ code: 200, message: "Cập nhật thành công" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }   
}
//DELETE /admin/topics/delete/:id
export const deleteTopic = async (req: Request, res: Response)=>{
    try{
        const topicId = req.params.id;
        await Topic.updateOne({_id: topicId}, { deleted: true });
        res.json({ code: 200, message: "Xóa thành công" });
    }catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}