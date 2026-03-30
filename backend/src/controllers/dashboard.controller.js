import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";
import { Subscription } from "../models/suscription.models.js";
import { objectId } from "../utils/objectId.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";

const getChannelStats = asyncHandler(async (req, res, next) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.);

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User cannot be unauthenticated.");
    }

    const totalStats = await User.aggregate([
        {
            $match: {
                _id: objectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "owner",
                localField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            owner: 1,
                            views: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "videos._id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos",
                },
                totalVideoLikes: {
                    $size: "$likes",
                },
                totalVideoViews: {
                    $sum: "$videos.views",
                },
                subscriberCount: {
                    $size: "$subscribers",
                },
            },
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                totalVideos: 1,
                totalVideoLikes: 1,
                totalVideoViews: 1,
                subscriberCount: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "User channel stats fetched successfully.",
                totalStats
            )
        );
});

const getChannelVideos = asyncHandler(async (req, res, next) => {
    // get all videos in channel

    const { page = 1, limit = 10 } = req.query;

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User cannot be unauthenticated.");
    }

    const aggregate = Video.aggregate({
        $match: {
            owner: objectId(userId),
        },
    });

    const videos = await Video.aggregatePaginate(aggregate, {
        page: Number(page),
        limit: Number(limit),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Channel videos fetched successfully.", videos)
        );
});

export { getChannelStats, getChannelVideos };
