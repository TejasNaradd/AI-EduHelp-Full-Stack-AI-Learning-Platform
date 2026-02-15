import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjwt } from "../middlewares/auth.middleware.js"
import { deleteDoc, generateSummary, getAllDocs, getDoc, getProgress, updateDoc, uploadDocument } from "../controllers/document.controller.js"

const router=Router()

router.route("/")
    .post(verifyjwt,upload.single("pdf-file"),uploadDocument)
    .get(verifyjwt,getAllDocs)

router.route("/:docId")
    .get(verifyjwt,getDoc)
    .delete(verifyjwt,deleteDoc)
    .patch(verifyjwt,updateDoc)

router.route("/:docId/summary")
    .post(verifyjwt,generateSummary)

router.route("/:docId/progress").get(verifyjwt,getProgress)


export default router