import { Request, Response } from "express";
import brypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Account from "../../models/account-model";
import Session from "../../models/session-model";
const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '7d'

//GET /admin/auth/login - không cần thiết nữa vì React tự render form
export const login = async (req: Request, res: Response) => {
    res.json({ code: 200, message: "Trang đăng nhập Admin" });
}
//POST /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body
        //KIỂM TRA TỒN TẠI
        const account = await Account.findOne({ username: username }).populate("role_id");
        if(!account){
            return res.status(400).json({ code: 400, message: "Tài khoản không tồn tại" });
        }
        //KIỂM TRA MẬT KHẨU
        const isMatch = await brypt.compare(password, account.password as string)
        if(!isMatch){
            return res.status(400).json({ code: 400, message: "Mật khẩu không đúng" });
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
        return res.json({
            code: 200,
            message: "Đăng nhập thành công",
            data: {
                fullname: account.fullname,
                email: account.email,
                role_id: account.role_id
            }
        });
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//POST /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return res.status(401).json({ code: 401, message: "Không có refresh token" });
    try {
        //Tìm token trong DB
        const tokenRecord = await Session.findOne({ token: oldRefreshToken });
        if (!tokenRecord) {
            return res.status(401).json({ code: 401, message: "Refresh token không hợp lệ" });
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
        return res.json({ code: 200, message: "Refresh token thành công" });
    } catch (err) {
        return res.status(500).json({ code: 500, message: "Lỗi server" });
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
    return res.json({ code: 200, message: "Đăng xuất thành công" });
}
//GET /admin/auth/me
export const me = async (req: Request, res: Response) => {
    // account is already populated with role_id in require-auth middleware
    const account = res.locals.account;
    return res.json({ code: 200, data: account });
}