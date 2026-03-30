import { Router } from "express";
import {
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getVideosByUserId,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/fetchAll").get(getAllVideos);
router.route("/:videoId").get(verifyJWT, getVideoById);
//  get /video/publish should have a form
router.route("/publish").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "videoFile",
      maxCount: 1,
    },
  ]),
  publishAVideo
);
router.route("/your-videos").post(verifyJWT, getVideosByUserId);
router.route("/update/:videoId").post(verifyJWT, updateVideo);
router.route("/delete/:videoId").post(verifyJWT, deleteVideo);
router.route("/toggle/publish/:videoId").post(verifyJWT, togglePublishStatus);
router.route("/:videoId/comments").get(getVideoComments);

export default router;
