import express from "express";
import { Authorized, Protect} from "../middleware/protect.js";
import { Checkidempotency } from "../middleware/idempotency.js";
import { createpass,verifypayment } from "../controllers/passController.js";

const UserRouter = express.Router();

// Authentication
UserRouter.post("/Update-pass",Protect,Checkidempotency, createpass);
UserRouter.post("/verifypayment",Protect, verifypayment);


export default UserRouter;