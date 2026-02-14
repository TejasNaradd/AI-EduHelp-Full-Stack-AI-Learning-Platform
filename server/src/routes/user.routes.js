import {Router} from "express"
import { registerUser,loginUser,getCurrentUser, logout,refreshAccessToken,updateProfile, updatePassword,googleLogin } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/register").post(upload.single("profileImage"),registerUser)
router.post("/google", googleLogin)
router.route("/login").post(loginUser)
router.route("/get-user").get(verifyjwt,getCurrentUser)
router.route("/logout").post(verifyjwt,logout)
router.route("/refresh").post(refreshAccessToken)
router.route("/update-profile").patch(verifyjwt,upload.single("profileImage"),updateProfile)
router.route("/update-password").patch(verifyjwt,updatePassword)

export default router