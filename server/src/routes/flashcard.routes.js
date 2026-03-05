import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { getAllFlashCards, markCardReviewed } from "../controllers/flashcard.controller.js";

const router=Router()

router.route("/").get(verifyjwt,getAllFlashCards)
router.patch("/review/:cardId", verifyjwt, markCardReviewed)

export default router