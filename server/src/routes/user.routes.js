import {Router} from "express"
import { registerUser,loginUser,getCurrentUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/register").post(upload.single("profileImage"),registerUser)
router.route("/login").post(loginUser)
router.route("/get-user").get(verifyjwt,getCurrentUser)

export default router