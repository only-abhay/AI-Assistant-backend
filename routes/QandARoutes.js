import express from "express"
const router = express.Router()
import CreateQandA, { getMyQuestions } from "../controllers/QandQController.js"
import fileUpload from "express-fileupload"
import Protect from "../middleware/protect.js"

router.post("/qa",fileUpload(),Protect, CreateQandA)
router.get("/my-questions", Protect, getMyQuestions)
export default router