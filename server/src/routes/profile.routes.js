import { Router } from "express";
import {
    updateBio
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// secure routes
router.route("/update-bio").patch(verifyJWT, updateBio)

export default router;