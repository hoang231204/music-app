import { Request, Response, NextFunction } from 'express';
import uploadToCloudinary from '../../helpers/upload-cloudinary';

export const uploadSingle = async (
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


export const uploadFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      const filesObject = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Lặp qua từng field (audio, cover, v.v...)
      for (const fieldname in filesObject) {
        const fileArray = filesObject[fieldname];
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const link = await uploadToCloudinary(file.buffer);
          req.body[fieldname] = link; // Gán URL vào req.body[fieldname]
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};