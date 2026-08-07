import User from "../../models/user-model";
import { Request, Response } from "express";
import createSearchRegex from "../../helpers/search-helper"
import filterStatusHelper from "../../helpers/filter-status-helper";
import paginationHelper from "../../helpers/pagination-helper";
//GET /admin/users
type taskStatus = "active" | "inactive";
interface FindQuery {
    deleted: boolean;
    status?: taskStatus;
    fullname?: { $regex: RegExp };
}
export const index = async (req: Request, res: Response) => {
    try{
        const findQuery: FindQuery = { deleted: false };
        //filter by status
        if (req.query.status && typeof req.query.status === "string") {
            findQuery.status = req.query.status as taskStatus;
        }
        const filterStatus = filterStatusHelper(req.query, "user");
        //search
         if (req.query.keyword && typeof req.query.keyword === "string") {
            const regex = createSearchRegex({ keyword: req.query.keyword });
            findQuery.fullname = { $regex: regex };
        }
        //sort
        const sort: Record<string, 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'> = {};
        if (req.query.sortBy && req.query.sortType) {
            const sortBy = req.query.sortBy as string;
            const sortType = req.query.sortType as 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
            sort[sortBy] = sortType;
        }
        //pagination
        const countData: number = await User.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query, countData);
        const limit = pagination.limitPage;
        const skip = pagination.skipPage;
        const users = await User.find(findQuery).sort(sort).limit(limit).skip(skip);
        res.render("admin/pages/users/index", {
            pageTitle: "Quản lý người dùng",
            users: users,
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
//GET /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
           res.redirect("/admin/users");
        }
        res.render("admin/pages/users/detail", {
            user: user,
            pageTitle: "Chi tiết người dùng",
        });
    }
    catch (err) {
        console.error(err);
        res.redirect("/admin/users");
    }
}