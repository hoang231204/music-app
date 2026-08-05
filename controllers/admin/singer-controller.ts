import Singer from "../../models/singer-model";
import { Request, Response } from "express";
import createSearchRegex from "../../helpers/search-helper"
import filterStatusHelper from "../../helpers/filter-status-helper";
import paginationHelper from "../../helpers/pagination-helper";
//GET /admin/singers
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
        const filterStatus = filterStatusHelper(req.query, "singer");
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
        const countData: number = await Singer.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query, countData);
        const limit = pagination.limitPage;
        const skip = pagination.skipPage;
        const singers = await Singer.find(findQuery).sort(sort).limit(limit).skip(skip);
        res.render("admin/pages/singers/index", {
            pageTitle: "Quản lý ca sĩ",
            singers: singers,
            keyword: req.query.keyword || "",
            filterStatus: filterStatus,
            objectPagination: pagination,
            countData: countData
        });
    }
    catch(err){
        console.error(err);
    }
}
//GET /admin/singers/create
export const create = async (req: Request, res: Response) => {
    try {
        res.render("admin/pages/singers/create", {
            pageTitle: "Thêm ca sĩ mới"
        });
    }
    catch (err) {
        console.error(err);
    }
}
//POST /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
    try{
        const fullname = req.body.fullname;
        const avatar = req.body.avatar;
        const status = req.body.status;
        const newSinger = new Singer({
            fullname: fullname,
            avatar: avatar,
            status: status,
            deleted: false
        });
        await newSinger.save();
        res.redirect("/admin/singers");
    }
    catch(err){
        console.error(err);
    }
}
//GET /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    try{
        const singerId = req.params.id;
        const singer = await Singer.findOne({_id: singerId});
        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa ca sĩ",
            singer: singer
        });
    }
    catch(err){
        console.error(err);
    }
}
//PATCH /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try{
        const singerId = req.params.id;
        const { fullname, avatar, status } = req.body;
        await Singer.updateOne({_id: singerId}, {
            fullname: fullname,
            avatar: avatar,
            status: status
        });
        res.redirect("/admin/singers");
    }
    catch(err){
        console.error(err);
    }
}