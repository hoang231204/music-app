import { Request, Response } from "express";
import brypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Account from "../../models/account-model";
import Session from "../../models/session-model";
const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '7d'

//GET /admin/auth/login
export const login = async (req: Request, res: Response) => {
    res.render("admin/pages/auth/login",{
        pageTitle: "Đăng nhập",
    })
}
//POST /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body
        //KIỂM TRA TỒN TẠI
        const account = await Account.findOne({ username: username })
        if(!account){
            return res.redirect('/admin/auth/login')
        }
        //KIỂM TRA MẬT KHẨU
        const isMatch = await brypt.compare(password, account.password as string)
        if(!isMatch){
            return res.redirect('/admin/auth/login')
        }
        //TẠO TOKEN
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
        const accessToken = jwt.sign({ userId: account._id }, ACCESS_TOKEN_SECRET as string, { expiresIn: ACCESS_TOKEN_TTL })
        const refreshToken = crypto.randomBytes(64).toString('hex')
        //LƯU TOKEN VÀO DB
        const session = new Session({
            userId: account._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        })
        await session.save()
        //RETURN KẾT QUẢ
        res.cookie('token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.redirect('/admin/dashboard')
    }
    catch(error){
        console.error(error)
        return res.redirect('/admin/auth/login')
    }
}
//POST /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return res.redirect('/admin/auth/login');
    try {
        //Tìm token trong DB
        const tokenRecord = await Session.findOne({ token: oldRefreshToken });
        if (!tokenRecord) {
            return res.redirect('/admin/auth/login');
        }
        //Xoay vòng (Rotation): Xóa cái cũ, tạo cái mới
        await Session.deleteOne({ token: oldRefreshToken });
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        const newAccessToken = jwt.sign({ userId: tokenRecord.userId }, ACCESS_TOKEN_SECRET as string, { expiresIn: ACCESS_TOKEN_TTL });
        const newRefreshToken = crypto.randomBytes(64).toString('hex');
        // Lưu mới vào DB
        await Session.create({
            userId: tokenRecord.userId,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        //Cập nhật Cookie
        res.cookie('token', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.redirect('/admin/dashboard'); 
    } catch (err) {
        return res.redirect('/auth/login');
    }
}
//POST /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await Session.deleteOne({ token: refreshToken });
    }
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return res.redirect('/admin/auth/login');
}