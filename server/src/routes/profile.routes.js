import { Router } from "express";
import {
    updateBio,
    updateUserCoverImage,
    uploadUserCoverImage,
    toggleTheme,
    getTheme
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/update-bio").patch(updateBio)
router.route("/cover-image").post(upload.single("coverImage"), uploadUserCoverImage)
router.route("/cover-image").patch(upload.single("coverImage"), updateUserCoverImage)
router.route("/toggle-theme").patch(toggleTheme)

export default router;