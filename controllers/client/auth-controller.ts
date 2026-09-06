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
    res.render("client/pages/auth/register",{
        pageTitle: "Đăng ký",
    })
}
//POST /auth/register
export const registerPost = async (req: Request, res: Response) => {
    try {
        const { username, fullname, email, password, confirm_password } = req.body;
        if (!username || !fullname || !email || !password || password !== confirm_password) {
            req.flash("error", "Vui lòng kiểm tra lại thông tin đăng ký!");
            return res.redirect("/auth/register");
        }
        const existedAccount = await Account.findOne({ username });
        if (existedAccount) {
            req.flash("error", "Tên đăng nhập đã tồn tại!");
            return res.redirect("/auth/register");
        }
        const hashedPassword = await brypt.hash(password, 10);
        await Account.create({ username, fullname, email, password: hashedPassword, status: "active", deleted: false });
        req.flash("success", "Đăng ký tài khoản thành công. Vui lòng đăng nhập!");
        return res.redirect("/auth/login");
    } catch (error) {
        console.error(error);
        req.flash("error", "Không thể đăng ký tài khoản lúc này!");
        return res.redirect("/auth/register");
    }
}
//GET /auth/login
export const login = async (req: Request, res: Response) => {
    res.render("client/pages/auth/login",{
        pageTitle: "Đăng nhập",
    })
}
//POST /auth/login
export const loginPost = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body
        //KIỂM TRA TỒN TẠI
        const account = await Account.findOne({ username: username })
        if(!account){
            req.flash("error", "Tên đăng nhập hoặc mật khẩu không đúng!");
            return res.redirect('/auth/login')
        }
        //KIỂM TRA MẬT KHẨU
        const isMatch = await brypt.compare(password, account.password as string)
        if(!isMatch){
            req.flash("error", "Tên đăng nhập hoặc mật khẩu không đúng!");
            return res.redirect('/auth/login')
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
        return res.redirect('/')
    }
    catch(error){
        console.error(error)
        return res.redirect('/auth/login')
    }
}
//POST /auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return res.redirect('/auth/login');
    try {
        //Tìm token trong DB
        const tokenRecord = await Session.findOne({ token: oldRefreshToken });
        if (!tokenRecord) {
            return res.redirect('/auth/login');
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
        return res.redirect('/'); 
    } catch (err) {
        return res.redirect('/auth/login');
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
    return res.redirect('/auth/login');
}