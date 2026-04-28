import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelDetails,
  getUserWatchHistory,
  getUserChannelSubscribers,
  getUserChannelSubscribersCount,
  getUserSubscribedCount,
  getUserSubscriptions,
  getUserChannelPage,
} from "../controllers/user.controller.js";

import {
  toggleSubscription,
  checkSubscription,
} from "../controllers/subscription.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(upload.none(), loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(upload.none(), refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/current-user").get(verifyJWT, getCurrentUser);

// check endpoints later : update images
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover")
  .patch(verifyJWT, upload.single("cover"), updateUserCoverImage);

//

router.route("/c/:username/details").get(getUserChannelDetails);
router.route("/c/:username/page").get(getUserChannelPage);

router
  .route("/c/:username/subscribersCount")
  .get(getUserChannelSubscribersCount);

router.route("/u/:username/subscribedCount").get(getUserSubscribedCount);

router
  .route("/c/:username/subscribers")
  .get(verifyJWT, getUserChannelSubscribers);

router.route("/c/:username/isSubscribed").get(verifyJWT, checkSubscription);
router.route("/c/:username/subscription").get(verifyJWT, getUserSubscriptions);
// subscribe/unsubscribe
router.route("/c/:username/subscription").post(verifyJWT, toggleSubscription);

router.route("/history").get(verifyJWT, getUserWatchHistory);

export default router;
