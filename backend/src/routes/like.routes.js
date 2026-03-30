import {
  toggleLikeComment,
  toggleLikeTweet,
  toggleLikeVideo,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/videos").get(verifyJWT, getLikedVideos);

export default router;
