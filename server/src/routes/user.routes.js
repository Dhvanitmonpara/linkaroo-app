import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    searchUser,
    updateBio,
    updateProfileSettings,
    uploadUserCoverImage,
    updateUserCoverImage,
    toggleTheme,
    sendOtp
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register/avatar").post(
    upload.single("avatar"),
    registerUser
)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/send-otp").post(sendOtp)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/search").patch(verifyJWT, searchUser)
router.route("/update-bio").patch(verifyJWT, updateBio)
router.route("/settings/update").post(verifyJWT, updateProfileSettings)
router.route("/cover-image")
    .post(verifyJWT, upload.single("coverImage"), uploadUserCoverImage)
    .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/theme").patch(verifyJWT, toggleTheme)

export default router;