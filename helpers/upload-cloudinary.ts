import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

const streamUpload = (buffer: Buffer): Promise<UploadApiResponse> => {
  cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

// Main function export
const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  const result: UploadApiResponse = await streamUpload(buffer);
  console.log('Upload result:', result);
  return result.secure_url;
};

export default uploadToCloudinary;