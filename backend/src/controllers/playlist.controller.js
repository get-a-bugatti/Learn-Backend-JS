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
    const { playlistId } = req.body;
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
    const { videoId, playlistId } = req.body;
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
    const { videoId, playlistId } = req.body;

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
            new ApiResponse(
                200,
                "Video removed from playlist successfully.",
                {}
            )
        );
});

export {
    createPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    deleteVideoFromPlaylist,
};
