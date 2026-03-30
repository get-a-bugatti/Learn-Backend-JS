import { Comment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { objectId } from "../utils/objectId.js";

const getVideoComments = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "Video Id is misssing.");
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: objectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",
                },
            },
        },
    ]);

    const comments = await Comment.aggregatePaginate(aggregate, {
        page: Number(page),
        limit: Number(limit),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Comments fetched successfully.",
                comments.docs
            )
        );
});

const addComment = asyncHandler(async (req, res, next) => {
    const { content, videoId, userId } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment cannot be empty.");
    }

    const result = await Comment.create({
        content,
        video: objectId(videoId),
        userId: objectId(userId),
    });

    if (!result) {
        throw new ApiError(
            500,
            "Something went wrong while adding the commment."
        );
    }

    return res.status(201).json(
        new ApiResponse(201, "Comment uploaded successfully.", {
            commentId: result._id,
        })
    );
});

const updateComment = asyncHandler(async (req, res, next) => {
    const { content, commentId } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment cannot be empty.");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError("No comment found for given commentId.");
    }

    const result = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content,
            },
        },
        {
            new: true,
        }
    ).select("content");

    if (!result) {
        throw new ApiError(
            500,
            "Somethign went wrong while updating comments."
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comments updated successfully.", result));
});

const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(400, "commentId is required.");
    }

    const result = await Comment.findByIdAndDelete(commentId);

    if (!result) {
        throw new ApiError(500, "Something went wrong while deleting comment.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment deleted successfully.", {}));
});

export { getVideoComments, addComment, updateComment, deleteComment };
