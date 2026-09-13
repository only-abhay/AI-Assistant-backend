import express from "express";
import { Authorized, Protect} from "../middleware/protect.js";


import {
  Register,
  Login,
  VerifyOTP,
  AddAddress,
  Read,
  deletebyId,
  GetProfile,
  Logout,
  adminLogin,
} from "../controllers/userController.js";

const UserRouter = express.Router();

// Authentication
UserRouter.post("/register", Register);
UserRouter.get("/get", Read);
UserRouter.post("/login", Login);
UserRouter.post("/adminlogin", adminLogin);
UserRouter.delete("/delete/:id", deletebyId);
UserRouter.get("/get-me",Protect, GetProfile);
UserRouter.get("/logout", Logout);
UserRouter.post("/verify-otp", VerifyOTP);

// Address
UserRouter.post("/address",Protect, AddAddress);


export default UserRouter;