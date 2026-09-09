import express from "express"
const router = express.Router()
import CreateQandA from "../controllers/QandQController.js"
import fileUpload from "express-fileupload"

router.post("/qa",fileUpload(),CreateQandA)
export default router