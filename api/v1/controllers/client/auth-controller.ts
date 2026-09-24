import { Request, Response } from "express";
import brypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Account from "../../models/account-model";
import Session from "../../models/session-model";
const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '7d'
//GET /auth/register
export const register = async (req: Request, res: Response) => {
    res.json({ code: 200, message: "Register page" })
}
//POST /auth/register
export const registerPost = async (req: Request, res: Response) => {
    try {
        const { username, fullname, email, password, confirm_password } = req.body;
        if (!username || !fullname || !email || !password || password !== confirm_password) {
            res.status(400).json({ code: 400, message: "Vui lòng kiểm tra lại thông tin đăng ký!" });
            return;
        }
        const existedAccount = await Account.findOne({ username });
        if (existedAccount) {
            res.status(400).json({ code: 400, message: "Tên đăng nhập đã tồn tại!" });
            return;
        }
        const hashedPassword = await brypt.hash(password, 10);
        await Account.create({ username, fullname, email, password: hashedPassword, status: "active", deleted: false });
        res.json({ code: 200, message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập!" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Không thể đăng ký tài khoản lúc này!" });
        return;
    }
}
//GET /auth/login
export const login = async (req: Request, res: Response) => {
    res.json({ code: 200, message: "Login page" })
}
//POST /auth/login
export const loginPost = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body
        //KIỂM TRA TỒN TẠI
        const account = await Account.findOne({ username: username })
        if(!account){
            res.status(400).json({ code: 400, message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
            return;
        }
        //KIỂM TRA MẬT KHẨU
        const isMatch = await brypt.compare(password, account.password as string)
        if(!isMatch){
            res.status(400).json({ code: 400, message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
            return;
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
        res.json({ code: 200, message: "Đăng nhập thành công!", token: accessToken, refreshToken });
        return;
    }
    catch(error){
        console.error(error)
        res.status(500).json({ code: 500, message: "Internal Server Error" });
        return;
    }
}
//POST /auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!oldRefreshToken) {
        res.status(401).json({ code: 401, message: "Unauthorized" });
        return;
    }
    try {
        //Tìm token trong DB
        const tokenRecord = await Session.findOne({ token: oldRefreshToken });
        if (!tokenRecord) {
            res.status(401).json({ code: 401, message: "Unauthorized" });
            return;
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
        res.json({ code: 200, token: newAccessToken, refreshToken: newRefreshToken });
        return;
    } catch (err) {
        res.status(500).json({ code: 500, message: "Internal Server Error" });
        return;
    }
}
//POST /auth/logout
export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await Session.deleteOne({ token: refreshToken });
    }
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ code: 200, message: "Đăng xuất thành công" });
    return;
}
//GET /auth/me
export const me = async (req: Request, res: Response) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ code: 401, message: "Chưa đăng nhập" });
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string };
        const account = await Account.findOne({ _id: payload.userId, status: "active", deleted: false }).select("-password");
        if (!account) {
            return res.status(401).json({ code: 401, message: "Tài khoản không hợp lệ" });
        }
        return res.json({ code: 200, data: account });
    } catch {
        return res.status(401).json({ code: 401, message: "Token không hợp lệ" });
    }
}