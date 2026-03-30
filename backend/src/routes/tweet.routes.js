import { Router } from "express";
import {
    addTweet,
    deleteTweet,
    getAllUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/all").get(getAllUserTweets);
router.route("/add").post(verifyJWT, addTweet);
router.route("/delete").post(verifyJWT, deleteTweet);
router.route("/update").post(verifyJWT, updateTweet);

export default router;
