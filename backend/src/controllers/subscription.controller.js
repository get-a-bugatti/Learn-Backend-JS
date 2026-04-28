import { Subscription } from "../models/subscription.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { objectId } from "../utils/objectId.js";
import { User } from "../models/user.models.js";

const toggleSubscription = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  if (typeof username !== "string") {
    throw new ApiError(400, "Invalid data type for username.");
  }

  const cleanedUsername = username.trim();

  if (!cleanedUsername) {
    throw new ApiError(400, "Username is required.");
  }

  const user = await User.findOne({
    username: cleanedUsername,
  });

  if (!user) {
    throw new ApiError(404, "Channel not found with that username.");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Invalid userId - User not logged in.");
  }

  const channelId = user._id;

  if (String(userId) === String(channelId)) {
    throw new ApiError(400, "Self-subscription setting disabled.");
  }

  const isSubscribed = await Subscription.exists({
    subscriber: userId,
    channel: objectId(channelId),
  });

  let result;

  if (!isSubscribed) {
    result = await Subscription.create({
      subscriber: req.user?._id,
      channel: objectId(channelId),
    });
  } else {
    result = await Subscription.findOneAndDelete({
      subscriber: userId,
      channel: objectId(channelId),
    });
  }

  if (!result) {
    throw new ApiError(
      500,
      "Something went wrong while subscribing/unsubscibing."
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Changed subscription successfully.", {}));
});

const checkSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { username } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const targetChannel = await User.findOne({ username }, { _id: 1 });

  if (!targetChannel) {
    throw new ApiError(404, "Channel not found");
  }

  const channelId = targetChannel._id;

  const isSubscribed = await Subscription.exists({
    subscriber: userId,
    channel: objectId(channelId),
  });

  let result;
  if (!isSubscribed) {
    result = false;
  } else {
    result = true;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Fetched subscription status successfully.", result)
    );
});

export { toggleSubscription, checkSubscription };
