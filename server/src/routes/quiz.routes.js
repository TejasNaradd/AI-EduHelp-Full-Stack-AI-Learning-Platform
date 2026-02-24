import {Router} from "express"
import { verifyjwt } from "../middlewares/auth.middleware.js"
import { getQuiz, submitQuiz } from "../controllers/quiz.controller.js"


const router=Router()

router.route("/:quizId").get(verifyjwt,getQuiz)
router.route("/:quizId/submit").post(verifyjwt,submitQuiz)

export default router