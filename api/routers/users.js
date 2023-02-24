import express from "express";
import { getUser } from "../controller/users.js";

const router = express.Router();

router.get('/test', getUser)

export default router
