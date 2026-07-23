import mongoose from "mongoose";
export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO as string);
        console.log("Conneted!")
    } catch (error) {
        console.log(error);
    }
}