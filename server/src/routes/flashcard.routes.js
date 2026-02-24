import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { getAllFlashCards } from "../controllers/flashcard.controller.js";

const router=Router()

router.route("/").get(verifyjwt,getAllFlashCards)

export default router