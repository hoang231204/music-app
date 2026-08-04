import { Request, Response, NextFunction } from 'express';
import uploadToCloudinary from '../../helpers/upload-cloudinary';

export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.file) {
      const link = await uploadToCloudinary(req.file.buffer);
      req.body[req.file.fieldname] = link;
    }
    next();
  } catch (error) {
    next(error);
  }
};