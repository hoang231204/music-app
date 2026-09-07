import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connect = async (): Promise<void> => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO) {
        throw new Error("MONGO environment variable is required");
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO, {
            serverSelectionTimeoutMS: 5000,
        }).catch((error) => {
            connectionPromise = null;
            throw error;
        });
    }

    await connectionPromise;
    console.log("Connected!");
}