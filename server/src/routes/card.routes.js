import { Router } from "express";
import {
    createCard, getCards, updateCard, deleteCard
} from "../controllers/card.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// secure routes
router.route("/").post(verifyJWT, createCard)
router.route("/").get(verifyJWT, getCards)
router.route("/:cardId").patch(verifyJWT, updateCard)
router.route("/:cardId").delete(verifyJWT, deleteCard)