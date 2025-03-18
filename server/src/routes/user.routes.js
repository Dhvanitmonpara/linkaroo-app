import { Router } from "express";
import {
    createUser,
    getCurrentUser,
    updateAccountDetails,
    searchUserByEmail,
    searchUserByUsername,
    updateBio,
    updateProfileSettings,
    uploadUserCoverImage,
    updateUserCoverImage,
    toggleTheme,
    sendOtp,
    sendFeedback
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/").post(createUser)
router.route("/send-otp").post(sendOtp)
router.route("/current/:email").get(getCurrentUser)
router.route("/update-account").patch(updateAccountDetails)
router.route("/update-bio").patch(updateBio)
router.route("/settings/update/:userId").post(updateProfileSettings)
router.route("/cover-image")
    .post(upload.single("coverImage"), uploadUserCoverImage)
    .patch(upload.single("coverImage"), updateUserCoverImage)
router.route("/theme").patch(toggleTheme)
router.route("/verified-search/email").patch(searchUserByEmail)
router.route("/feedback").post(sendFeedback)
router.route("/search/email").patch(searchUserByEmail)
router.route("/verified-search/username").patch(searchUserByUsername)
router.route("/search/username").patch(searchUserByUsername)

export default router;