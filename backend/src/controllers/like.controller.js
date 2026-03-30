import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { objectId } from "../utils/objectId.js";
import { Like } from "../models/like.models.js";

const toggleLikeVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;

  const isLiked = await Like.exists({
    video: objectId(videoId),
    likedBy: objectId(req.user?._id),
  });

  let result;
  if (isLiked) {
    result = await Like.deleteOne({
      video: objectId(videoId),
      likedBy: objectId(req.user?._id),
    });
  } else {
    result = await Like.create({
      video: objectId(videoId),
      likedBy: objectId(req.user?._id),
    });
  }

  if (!result) {
    throw new ApiError(500, "Something went wrong liking the video.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Liked Video successfully.", {}));
});
const toggleLikeComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.body;

  const isLiked = await Like.exists({
    comment: objectId(commentId),
    likedBy: objectId(req.user?._id),
  });

  let result;
  if (isLiked) {
    result = await Like.deleteOne({
      comment: objectId(commentId),
      likedBy: objectId(req.user?._id),
    });
  } else {
    result = await Like.create({
      comment: objectId(commentId),
      likedBy: objectId(req.user?._id),
    });
  }

  if (!result) {
    throw new ApiError(500, "Something went wrong liking the comment.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Liked Comment successfully.", {}));
});
const toggleLikeTweet = asyncHandler(async (req, res, next) => {
  const { tweetId } = req.body;

  const isLiked = await Like.exists({
    tweet: objectId(tweetId),
    likedBy: objectId(req.user?._id),
  });

  let result;
  if (isLiked) {
    result = await Like.deleteOne({
      tweet: objectId(tweetId),
      likedBy: objectId(req.user?._id),
    });
  } else {
    result = await Like.create({
      tweet: objectId(tweetId),
      likedBy: objectId(req.user?._id),
    });
  }

  if (!result) {
    throw new ApiError(500, "Something went wrong liking the tweet.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Liked Tweet successfully.", {}));
});

const getLikedComments = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const aggregate = Like.aggregate([
    {
      $match: {
        likedBy: userId,
        comment: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comment",
        foreignField: "_id",
        as: "comment",
      },
    },
    { $unwind: "$comment" },
    {
      $replaceRoot: { newRoot: "$comment" },
    },
  ]);

  const videos = await Like.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Liked Comments fetched successfully.", comments)
    );
});

const getLikedTweets = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const aggregate = Like.aggregate([
    {
      $match: {
        likedBy: userId,
        tweet: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweet",
      },
    },
    { $unwind: "$tweet" },
    {
      $replaceRoot: { newRoot: "$tweet" },
    },
  ]);

  const videos = await Like.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Liked Tweets fetched successfully.", tweets));
});

const getLikedVideos = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const aggregate = Like.aggregate([
    {
      $match: {
        likedBy: userId,
        video: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    { $unwind: "$video" },
    {
      $replaceRoot: { newRoot: "$video" },
    },
  ]);

  const videos = await Like.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Liked Videos fetched successfully.", videos));
});

export {
  toggleLikeVideo,
  toggleLikeTweet,
  toggleLikeComment,
  getLikedVideos,
  getLikedComments,
  getLikedTweets,
};
