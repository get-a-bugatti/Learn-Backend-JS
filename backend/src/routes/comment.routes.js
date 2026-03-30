import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    deleteComment,
    updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addComment);
router.route("/update").post(verifyJWT, updateComment);
router.route("/delete").post(verifyJWT, deleteComment);

export default router;
