import { Router } from "express";
import {
    updateBio,
    updateUserCoverImage,
    uploadUserCoverImage,
    toggleTheme, 
    updateProfileSettings
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/update-bio").patch(updateBio)
router.route("/settings/update").post(updateProfileSettings)
router.route("/cover-image").post(upload.single("coverImage"), uploadUserCoverImage)
router.route("/cover-image").patch(upload.single("coverImage"), updateUserCoverImage)
router.route("/theme").patch(toggleTheme)

export default router;
