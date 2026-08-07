import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Account from '../../models/account-model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
    const token = req.cookies.token
    if(token){
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string ) as { userId: string };
            const account = await Account.findById(decoded.userId).select("-hashedPassword").lean();
            if(account){
                res.locals.account = account;
                next();
            }else{
                res.clearCookie('token');
                return res.redirect('/admin/auth/login');
            }
        } catch (error) {
            res.clearCookie('token');
            return res.redirect('/admin/auth/login');
        }
    }else{
        if(req.cookies.refreshToken){
            return res.redirect('/admin/auth/refresh-token');
        }
        else{
            return res.redirect('/admin/auth/login');
        }
    }
}