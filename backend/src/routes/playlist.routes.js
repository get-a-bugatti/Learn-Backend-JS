import { Router } from "express";
import {
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  deleteVideoFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
} from "../controllers/playlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔐 All playlist routes require auth
router.use(verifyJWT);

// ✅ Create playlist
router.get("/", getUserPlaylists);
router.post("/", createPlaylist);

// ✅ Delete playlist
router.get("/:playlistId", getPlaylistById);
router.delete("/:playlistId", deletePlaylist);

// ✅ Add video to playlist
router.post("/:playlistId/videos", addVideoToPlaylist);

// ✅ Remove video from playlist
router.delete("/:playlistId/videos/:videoId", deleteVideoFromPlaylist);

export default router;
