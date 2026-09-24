import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Account from '../../models/account-model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
    const token = req.cookies.token
    if(token){
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string ) as { userId: string };
            const account = await Account.findById(decoded.userId).select("-password").populate("role_id").lean();
            if(account){
                res.locals.account = account;
                next();
            }else{
                res.clearCookie('token');
                return res.status(401).json({ code: 401, message: "Tài khoản không tồn tại" });
            }
        } catch (error) {
            res.clearCookie('token');
            return res.status(401).json({ code: 401, message: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }else{
        if(req.cookies.refreshToken){
            // Trả về mã đặc biệt để Frontend biết cần refresh token
            return res.status(401).json({ code: 401, message: "Token hết hạn", refreshable: true });
        }
        else{
            return res.status(401).json({ code: 401, message: "Chưa đăng nhập" });
        }
    }
}