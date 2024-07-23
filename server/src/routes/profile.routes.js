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

// secure routes
router.route("/update-bio").patch(verifyJWT, updateBio)
router.route("/cover-image").post(verifyJWT, upload.single("coverImage"), uploadUserCoverImage)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/toggle-theme").patch(verifyJWT, toggleTheme)

export default router;