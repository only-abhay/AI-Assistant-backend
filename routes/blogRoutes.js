import express from "express";

import { generateBlog, getMyBlogs } from "../controllers/blogController.js";
import Protect from "../middleware/protect.js"


const router = express.Router();

router.post("/generate", Protect, generateBlog);
router.get("/my-blogs", Protect, getMyBlogs);

export default router;