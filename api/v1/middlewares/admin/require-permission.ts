import { Request, Response, NextFunction } from 'express';

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const account = res.locals.account;
        if (!account) {
            return res.status(401).json({ code: 401, message: "Chưa đăng nhập" });
        }

        const permissions = account.role_id?.permissions || [];
        if (permissions.includes(permission)) {
            next();
        } else {
            return res.status(403).json({ code: 403, message: "Không có quyền truy cập chức năng này" });
        }
    };
};
