import User from "../../models/user-model";
import { Request, Response } from "express";
import createSearchRegex from "../../../../helpers/search-helper"
import filterStatusHelper from "../../../../helpers/filter-status-helper";
import paginationHelper from "../../../../helpers/pagination-helper";
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
        res.json({
            code: 200,
            data: {
                users: users,
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
//GET /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        res.json({ code: 200, data: user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//PATCH /admin/users/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        const newStatus = user.status === "active" ? "inactive" : "active";
        await User.updateOne({ _id: userId }, { status: newStatus });
        res.json({ code: 200, message: `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} người dùng`, status: newStatus });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//DELETE /admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        await User.updateOne({ _id: userId }, { deleted: true, deletedAt: new Date() });
        res.json({ code: 200, message: "Đã xóa người dùng" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}