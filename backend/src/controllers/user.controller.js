import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { objectId } from "../utils/objectId.js";
import { Subscription } from "../models/subscription.models.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while generating Tokens."
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some(
      (field) => String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields are Required !!!");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath)
    throw new ApiError(500, "Avatar is required. Local Path error");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    console.log("Avatar response from cloudinary ::", avatar);
    throw new ApiError(500, "Avatar is required. Error at Cloudinary");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User Registered Successfully.", createdUser));
});

const loginUser = asyncHandler(async (req, res, next) => {
  // take email and password from form
  // find user  -> check if user exists
  // check if email-password pair is correct
  // generate an access token and a refresh token
  // send cookies
  const { login, password } = req.body;

  if (!login) {
    throw new ApiError(400, "Username or Email is required.");
  }

  const foundUser = await User.findOne({
    $or: [{ email: login }, { username: login }],
  });

  if (!foundUser) {
    throw new ApiError(404, "User does not exist.");
  }

  const isPasswordValid = await foundUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    foundUser._id
  );

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };

  const loggedInUser = (
    await User.findById(foundUser._id).select("-password -refreshToken")
  ).toObject();
  // can also use .lean() instead of .toObject();

  // or u can also do:
  // const loggedInUser = foundUser.toObject();
  // delete loggedInUser.password;
  // delete loggedInUser.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };

  // TODO : FIX : FOR SOME REASON, cant clear cookies
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "User Logged out."));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    // take refresh token incoming
    // decode refresh token, and extract userId inside
    // find user iwth that id
    // handle (if no user)
    // check the found user's refreshtoken
    // if refreshToken = foundUser.refreshToken
    // generate new access and refresh tokens
    // else
    // throw error
    // return res , set new access tokens and refresh tokeons and cookies and return in data

    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request.");
    }

    // console.log(
    //     "incoming refresh token is :",
    //     incomingRefreshToken,
    //     typeof incomingRefreshToken
    // );

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token.");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      decodedToken?._id
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, "Web Tokens refreshed successfully."));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Refresh Token.");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confPassword } = req.body;

  if (
    [oldPassword, newPassword, confPassword].some(
      (el) => String(el).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User cannot be unauthenticated.");
  }

  if (newPassword !== confPassword) {
    throw new ApiError(400, "Both Password fields must be same.");
  }

  const targetUser = await User.findById(req.user?._id);

  const isPasswordCorrect = await targetUser.isPasswordCorrect(oldPassword);
  const isOldAndNewPassSame = await targetUser.isPasswordCorrect(newPassword);

  if (isOldAndNewPassSame) {
    throw new ApiError(403, "New password cannot be same as old password.");
  }

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Old Password.");
  }

  targetUser.password = newPassword;
  await targetUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully.", {}));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched Successfully.", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
  const { username, email, fullName } = req.body;

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof fullName !== "string"
  ) {
    throw new ApiError(400, "Invalid input type.");
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim();
  const cleanFullName = fullName.trim();

  if (!cleanUsername || !cleanEmail || !cleanFullName) {
    throw new ApiError(400, "All fields are required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: String(fullName),
        email: String(email),
        username: String(username),
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Account details updated successfully", user));
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file not found.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Couldn't upload file.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (fs.existsSync(avatarLocalPath)) {
    fs.unlinkSync(avatarLocalPath);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar Updated Successfully.", user));
});

const updateUserCoverImage = asyncHandler(async (req, res, next) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar file not found.");
  }

  const avatar = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Couldn't upload file.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (fs.existsSync(coverImageLocalPath)) {
    fs.unlinkSync(coverImageLocalPath);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar Updated Successfully.", user));
});

const getUserChannelDetails = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is required.");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
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
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        email: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  if (!channel) {
    throw new ApiError(404, "Channel does not exist.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Requested channel fetched sucessfully.", channel[0])
    );
});

const getUserWatchHistory = asyncHandler(async (req, res, next) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: objectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
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
        ],
      },
    },
  ]);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Watch history fetched successfully.",
        user[0].watchHistory
      )
    );
});

const getUserChannelSubscribersCount = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  if (typeof username !== "string") {
    throw new ApiError(400, "Username must be a string.");
  }

  const cleanedUsername = username.trim();

  if (!cleanedUsername) {
    throw new ApiError(400, "Invalid username.");
  }

  const user = await User.findOne({
    username: cleanedUsername,
  });

  if (!user) {
    throw new ApiError(404, "Couldn't find channel with that username.");
  }

  const subscribersCount = await Subscription.countDocuments({
    channel: user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Fetched subscribers count successfully.",
        subscribersCount
      )
    );
});

const getUserSubscribedCount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (typeof userId !== "string") {
    throw new ApiError(400, "UserId must be a string.");
  }

  const clenaedUserId = userId.trim();

  if (!clenaedUserId) {
    throw new ApiError(400, "Valid UserId is required.");
  }

  const subscribedToCount = await Subscription.countDocuments({
    subscriber: objectId(userId),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "fetched subscribed channels count successfuly.",
        subscribedToCount
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!username || typeof username !== "string") {
    throw new ApiError(400, "Invalid username.");
  }

  const cleanedUsername = username.trim();

  if (!cleanedUsername) {
    throw new ApiError(400, "Username is required.");
  }

  const user = await User.findOne({
    username: cleanedUsername,
  });

  if (!user) {
    throw new ApiError(404, "Could not find channel with that username.");
  }

  const currentUserId = req.user?._id;

  if (!currentUserId) {
    throw new ApiError(400, "User cannot be unauthenticated.");
  }

  if (String(currentUserId) !== String(user._id)) {
    throw new ApiError(403, "Cannot view other user's subscribers.");
  }

  const aggregate = Subscription.aggregate([
    {
      $match: {
        channel: user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
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
  ]);

  const subscribers = await Subscription.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Subscribers fetched successfully.",
        subscribers.docs
      )
    );
});

const getUserSubscriptions = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const { page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new ApiError(401, "User not logged in.");
  }

  // const aggregate = Subscription.aggregate([
  //   {
  //     $match: {
  //       subscriber: objectId(userId),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "channel",
  //       foreignField: "_id",
  //       as: "channel",
  //       pipeline: [
  //         {
  //           $project: {
  //             fullName: 1,
  //             username: 1,
  //             avatar: 1,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ]);

  const aggregate = Subscription.aggregate([
    {
      $match: {
        subscriber: objectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
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
              subscribersCount: { $size: "$subscribers" },
              isSubscribed: {
                $in: [objectId(userId), "$subscribers.subscriber"],
              },
            },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              subscribersCount: 1,
              isSubscribed: 1,
            },
          },
        ],
      },
    },

    // flatten (important)
    { $unwind: "$channel" },
    { $replaceRoot: { newRoot: "$channel" } },
  ]);

  const subscriptions = await Subscription.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Subscribers fetched successfully.",
        subscriptions.docs
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelDetails,
  getUserWatchHistory,
  getUserChannelSubscribers,
  getUserSubscribedCount,
  getUserChannelSubscribersCount,
  getUserSubscriptions,
};
