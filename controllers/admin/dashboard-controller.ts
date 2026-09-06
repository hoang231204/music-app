import { Request, Response } from "express";
import Song from "../../models/song-model";
import Singer from "../../models/singer-model";
import Topic from "../../models/topic-model";
import User from "../../models/user-model";

const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");

const getMonthlyTrend = (dates: Date[]) => {
    const now = new Date();
    const currentMonth = dates.filter((date) => date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()).length;
    const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = dates.filter((date) => date.getMonth() === previousMonthDate.getMonth() && date.getFullYear() === previousMonthDate.getFullYear()).length;
    if (previousMonth === 0) return { value: currentMonth ? "100%" : "0%", trendUp: currentMonth > 0 };

    const percentage = Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
    return { value: `${Math.abs(percentage)}%`, trendUp: percentage >= 0 };
};

export const index = async (req: Request, res: Response) => {
    try {
        const [
            totalSongs,
            totalSingers,
            totalUsers,
            totalTopics,
            recentSongs,
            recentUsers,
            songDates,
            singerDates,
            userDates,
            topicDates,
        ] = await Promise.all([
            Song.countDocuments({ deleted: false }),
            Singer.countDocuments({ deleted: false }),
            User.countDocuments({ deleted: false }),
            Topic.countDocuments({ deleted: false }),
            Song.find({ deleted: false })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("singer_id", "fullname")
                .lean(),
            User.find({ deleted: false }).sort({ createdAt: -1 }).limit(5).lean(),
            Song.find({ deleted: false }).select("createdAt").lean(),
            Singer.find({ deleted: false }).select("createdAt").lean(),
            User.find({ deleted: false }).select("createdAt").lean(),
            Topic.find({ deleted: false }).select("createdAt").lean(),
        ]);

        const dashboardData = {
            totalSongs,
            totalSingers,
            totalUsers,
            totalTopics,
            songTrend: getMonthlyTrend(songDates.map((song) => song.createdAt)),
            singerTrend: getMonthlyTrend(singerDates.map((singer) => singer.createdAt)),
            userTrend: getMonthlyTrend(userDates.map((user) => user.createdAt)),
            topicTrend: getMonthlyTrend(topicDates.map((topic) => topic.createdAt)),
            recentSongs: recentSongs.map((song) => ({
                title: song.title || "Chưa cập nhật",
                singer: (song.singer_id as unknown as { fullname?: string } | null)?.fullname || "Chưa cập nhật",
                likes: song.like || 0,
                status: song.status === "active" ? "active" : "inactive",
            })),
            recentUsers: recentUsers.map((user) => ({
                name: user.fullname || "Chưa cập nhật",
                email: user.email || "Chưa cập nhật",
                avatar: user.avatar,
                joinDate: formatDate(user.createdAt),
                status: user.status,
            })),
        };

        return res.render("admin/pages/dashboard", { title: "Dashboard", dashboardData });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Không thể tải dữ liệu dashboard.");
    }
};