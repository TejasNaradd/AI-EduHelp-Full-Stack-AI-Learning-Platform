import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats",verifyjwt,getDashboardStats)

export default router