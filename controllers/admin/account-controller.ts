import Account from "../../models/account-model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import createSearchRegex from "../../helpers/search-helper"
import filterStatusHelper from "../../helpers/filter-status-helper";
import paginationHelper from "../../helpers/pagination-helper";
import Role from "../../models/role-model";
//GET /admin/singers
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
        const filterStatus = filterStatusHelper(req.query, "singer");
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
        const countData: number = await Account.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query, countData);
        const limit = pagination.limitPage;
        const skip = pagination.skipPage;
        const accounts = await Account
            .find(findQuery)
            .sort(sort).limit(limit).skip(skip)
            .select("fullname email role_id status createdBy")
            .populate("role_id", "title");
        res.render("admin/pages/accounts/index", {
            pageTitle: "Quản lý tài khoản",
            accounts: accounts,
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
    try{
        const roles = await Role.find({ deleted: false }).select("title");
        res.render("admin/pages/accounts/create", {
            pageTitle: "Tạo mới tài khoản",
            roles: roles
        });
    }
    catch(err){
        console.error(err);
    }
}
//POST /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
    try{
        const {username, fullname, email, password, role_id, avatar, status } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = new Account({
            username: username,
            fullname: fullname,
            email: email,
            password: hashedPassword,
            role_id: role_id,
            avatar: avatar,
            status: status,
            deleted: false
        });
        await newAccount.save();
        res.redirect("/admin/accounts");
    }
    catch(err){
        console.error(err);
    }
}
//GET /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    try{
        const accountId = req.params.id;
        const account = await Account.findById(accountId).select("-password").populate("role_id", "title");
        const roles = await Role.find({ deleted: false }).select("title");
        if (!account) {
            res.redirect("/admin/accounts");
        }
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account,
            roles: roles
        });
    }
    catch(err){
        console.error(err);
    }
}
//PATCH /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try{
        const accountId = req.params.id;
        const {username, fullname, email, password, role_id, avatar, status } = req.body;
        if(password === ""){
            await Account.updateOne({ _id: accountId }, {
                username: username,
                fullname: fullname,
                email: email,
                role_id: role_id,
                avatar: avatar,
                status: status
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await Account.updateOne({ _id: accountId }, {
                username: username,
                fullname: fullname,
                email: email,
                password: hashedPassword,
                role_id: role_id,
                avatar: avatar,
                status: status
            });
        }
        res.redirect("/admin/accounts");
    }
    catch(err){
        console.error(err);
    }
}
//DELETE /admin/singers/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
    try{
        const accountId = req.params.id;
        await Account.updateOne({ _id: accountId }, { deleted: true });
        res.redirect("/admin/accounts");
    }
    catch(err){
        console.error(err);
    }
}