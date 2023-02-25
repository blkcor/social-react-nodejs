import express from "express";
import { getComments, addComment } from "../controller/comments.js";

const router = express.Router();

router.get('/', getComments)
router.post('/', addComment)

export default router
