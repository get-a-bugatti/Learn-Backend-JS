import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.models.js";
import { objectId } from "../utils/objectId.js";

const createPlaylist = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User cannot be unauthenticated.");
  }

  const doesPlaylistExist = await Playlist.exists({
    name,
    owner: objectId(userId),
  });

  if (doesPlaylistExist) {
    throw new ApiError(400, "Playlist with that name already exists.");
  }

  const result = await Playlist.create({
    name,
    description,
    owner: objectId(userId),
  });

  return res.status(200).json(
    new ApiResponse(200, "Playlist created successfully.", {
      playlistId: result._id,
    })
  );
});

const deletePlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User cannot be unauthenticated.");
  }

  const result = await Playlist.findOneAndDelete({
    _id: objectId(playlistId),
    owner: objectId(userId),
  });

  if (!result) {
    throw new ApiError(404, "Playlist not found or unauthorized.");
  }

  return res.status(200).json(
    new ApiResponse(200, "Playlist deleted successfully.", {
      playlistId: result._id,
    })
  );
});

const addVideoToPlaylist = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User cannot be unauthenticated.");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    {
      _id: objectId(playlistId),
      owner: objectId(userId),
    },
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or unauthorized.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Added video to playlist successfully.",
        updatedPlaylist
      )
    );
});

const deleteVideoFromPlaylist = asyncHandler(async (req, res, next) => {
  const { videoId, playlistId } = req.params;

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User cannot be unauthenticated.");
  }

  const result = await Playlist.findOneAndUpdate(
    {
      _id: objectId(playlistId),
      owner: objectId(userId),
    },
    {
      $pull: {
        videos: objectId(videoId),
      },
    },
    {
      new: true,
    }
  );

  if (!result) {
    throw new ApiError(404, "Video not found or unauthorized.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Video removed from playlist successfully.", {})
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: objectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        let: { videoIds: "$videos" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$videoIds"] } } },
          { $project: { thumbnail: 1 } },
          { $limit: 1 }, // only need one thumbnail
        ],
        as: "videosData",
      },
    },
    {
      $addFields: {
        videosCount: { $size: "$videos" },
        thumbnail: { $arrayElemAt: ["$videosData.thumbnail", 0] },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videosCount: 1,
        thumbnail: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlists fetched successfully", playlists));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: objectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner", // field in videos
              foreignField: "_id", // field in users
              as: "owner",
            },
          },
          {
            $unwind: {
              path: "$owner",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $addFields: {
        videosCount: { $size: "$videos" },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        videosCount: 1,
        "owner.username": 1,
        "owner.fullName": 1,
        "owner.avatar": 1,
      },
    },
  ]);

  if (!playlist.length) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched successfully", playlist[0]));
});

export {
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  deleteVideoFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
};
