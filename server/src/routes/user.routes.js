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
    searchUserByEmail,
    searchUserByUsername,
    updateBio,
    updateProfileSettings,
    uploadUserCoverImage,
    updateUserCoverImage,
    passwordRecovery,
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
router.route("/recover-password").patch(passwordRecovery)
router.route("/refresh-token").post(refreshAccessToken)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-bio").patch(verifyJWT, updateBio)
router.route("/settings/update").post(verifyJWT, updateProfileSettings)
router.route("/cover-image")
.post(verifyJWT, upload.single("coverImage"), uploadUserCoverImage)
.patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/theme").patch(verifyJWT, toggleTheme)
router.route("/verified-search/email").patch(verifyJWT, searchUserByEmail)
router.route("/search/email").patch(searchUserByEmail)
router.route("/verified-search/username").patch(verifyJWT, searchUserByUsername)
router.route("/search/username").patch(searchUserByUsername)

export default router;