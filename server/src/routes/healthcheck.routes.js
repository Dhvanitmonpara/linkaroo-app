import { Router } from "express";
import {
    healthcheck
} from "../controllers/healthcheck.controller";

const router = Router()

// secure routes
router.route("/").post(healthcheck)