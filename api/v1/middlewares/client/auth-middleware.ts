import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Account, { IAccount } from "../../models/account-model";
import FavoriteSong from "../../models/favorite-song-model";

declare global {
  namespace Express {
    interface Request {
      user?: IAccount;
    }
  }
}

const getAccountFromToken = async (req: Request) => {
  const token = req.cookies?.token;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string };
    return Account.findOne({ _id: payload.userId, status: "active", deleted: false });
  } catch {
    return null;
  }
};

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await getAccountFromToken(req);
    if (account) {
      req.user = account;
      res.locals.user = account;
      const favorites = await FavoriteSong.find({ user_id: account._id.toString() }).select("song_id").lean();
      res.locals.favoriteSongIds = favorites.map((favorite) => favorite.song_id);
    }
    res.locals.flash = {
      success: req.flash("success"),
      error: req.flash("error"),
      warning: req.flash("warning"),
      info: req.flash("info"),
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireUserAuth = async (req: Request, res: Response, next: NextFunction) => {
  const account = await getAccountFromToken(req);
  if (account) {
    req.user = account;
    return next();
  }

  const message = "Vui lòng đăng nhập để thực hiện chức năng này!";
  req.flash("error", message);
  const acceptsJson = req.xhr || req.get("accept")?.includes("application/json");
  if (acceptsJson) {
    return res.status(401).json({ code: 401, message });
  }
  return res.redirect("/auth/login");
};