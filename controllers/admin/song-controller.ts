import Song from "../../models/song-model";
import Topic from "../../models/topic-model";
import Singer from "../../models/singer-model";
import { Request, Response } from "express";
import createSearchRegex from "../../helpers/search-helper"
import filterStatusHelper from "../../helpers/filter-status-helper";
import paginationHelper from "../../helpers/pagination-helper";
//GET /admin/songs
type taskStatus = "active" | "inactive";
interface FindQuery {
    deleted: boolean;
    status?: taskStatus;
    title?: { $regex: RegExp };
}
export const index = async (req: Request, res: Response) => {
    try {
        const findQuery: FindQuery = { deleted: false };
        //filter by status
        if (req.query.status && typeof req.query.status === "string") {
            findQuery.status = req.query.status as taskStatus;
        }
        const filterStatus = filterStatusHelper(req.query, "song");
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
        const countData: number = await Song.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query, countData);
        const limit = pagination.limitPage;
        const skip = pagination.skipPage;
        const songs = await Song.find(findQuery).sort(sort).limit(limit).skip(skip).populate("singer_id","fullname");
        res.render("admin/pages/songs/index", {
            pageTitle: "Quản lý bài hát",
            songs: songs,
            keyword: req.query.keyword || "",
            filterStatus: filterStatus,
            objectPagination: pagination,
            countData: countData
        });
    }
    catch (err) {
        console.error(err);
    }
}
//GET /admin/songs/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const songId = req.params.id;
        const song = await Song.findOne({ _id: songId }).populate("singer_id topic_id", "fullname title");
        if (!song) {
            return res.redirect("/admin/songs");
        }
        res.render("admin/pages/songs/detail", {
            pageTitle: "Chi tiết bài hát",
            song: song
        });
    }
    catch (err) {
        console.error(err);
    }
}
//GET /admin/songs/create
export const create = async (req: Request, res: Response) => {
    try {
        const singers = await Singer.find({ deleted: false }).select("fullname");
        const topics = await Topic.find({ deleted: false }).select("title");
        res.render("admin/pages/songs/create", {
            pageTitle: "Thêm bài hát mới",
            singers: singers,
            topics: topics
        });
    }
    catch (err) {
        console.error(err);
    }
}
//POST /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const lyrics = req.body.lyrics;
        const status = req.body.status;
        const singer_id = req.body.singerId
        const topic_id = req.body.topicId;
        const avatar = req.body.avatar;
        const audio = req.body.audio;
        const newSong = new Song({
            title: title,
            singer_id: singer_id,
            topic_id: topic_id,
            description: description,
            lyrics: lyrics,
            avatar: avatar,
            audio: audio,
            status: status  
        });
        await newSong.save();
        res.redirect("/admin/songs");
    }
    catch (err) {
        console.error(err);
    }
}
//GET /admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const songId = req.params.id;
        const song = await Song.findOne({ _id: songId }).populate("singer_id topic_id", "fullname title");
        if (!song) {
            return res.redirect("/admin/songs");
        }
        const singers = await Singer.find({ deleted: false }).select("fullname");
        const topics = await Topic.find({ deleted: false }).select("title");
        res.render("admin/pages/songs/edit", {
            pageTitle: "Chỉnh sửa bài hát",
            song: song,
            singers: singers,
            topics: topics
        });
    }
    catch (err) {
        console.error(err);
    }
}
//PATCH /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const songId = req.params.id;
        const title = req.body.title;
        const description = req.body.description;
        const lyrics = req.body.lyrics;
        const status = req.body.status;
        const singer_id = req.body.singerId;
        const topic_id = req.body.topicId;
        const avatar = req.body.avatar;
        const audio = req.body.audio;
        await Song.updateOne({ _id: songId }, {
            title: title,
            singer_id: singer_id,
            topic_id: topic_id,
            description: description,
            lyrics: lyrics,
            avatar: avatar,
            audio: audio,
            status: status
        });
        res.redirect("/admin/songs");
    }
    catch (err) {
        console.error(err);
    }
}
//PATCH /admin/songs/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try{
        const type = req.body.type;
        const idschecked = req.body.ids;
        const ids = idschecked.split(",");
        if(type === "delete"){
            await Song.updateMany({_id: {$in: ids}}, {deleted: true});
        }
        else if(type === "active" || type === "inactive"){
            await Song.updateMany({_id: {$in: ids}}, {status: type});
        }
        res.redirect("/admin/songs");
    }
    catch(err){
        console.error(err);
    }   
}