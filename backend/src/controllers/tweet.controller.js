import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { objectId } from "../utils/objectId.js";
import { Tweet } from "../models/tweet.models.js";

const getAllUserTweets = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const aggregate = Tweet.aggregate([
    {
      $match: {
        content: { $ne: null },
      },
    },
  ]);

  const tweets = await Tweet.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched all tweets successfully.", tweets));
});

const addTweet = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError("User is not logged in.");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet cannot be empty.");
  }

  const result = await Tweet.create({
    content,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Added new tweet successfully.", {}));
});

const deleteTweet = asyncHandler(async (req, res, next) => {
  const { tweetId } = req.body;

  if (!tweetId || typeof tweetId !== "string") {
    throw new ApiError(400, "tweetId must be a valid string.");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError("User is not logged in.");
  }

  const result = await Tweet.findOneAndDelete({
    _id: objectId(tweetId),
    owner: objectId(userId),
  });

  if (!result) {
    throw new ApiError(500, "Could not find tweet or unauthorized action.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Deleted tweet succesfully.", {}));
});

const updateTweet = asyncHandler(async (req, res, next) => {
  const { content, tweetId } = req.body;

  if (!content || !String(content).trim()) {
    throw new ApiError(400, "Content is required.");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User cannot be unauthenticated.");
  }

  const result = await Tweet.findOneAndUpdate(
    {
      _id: objectId(tweetId),
      owner: userId,
    },
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  ).select("content");

  if (!result) {
    throw new ApiError(404, "Could not find tweet or unauthorized action.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Updated tweet succesfully.", result));
});

export { getAllUserTweets, addTweet, deleteTweet, updateTweet };
