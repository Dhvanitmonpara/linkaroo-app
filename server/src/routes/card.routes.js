import { Router } from "express";
import {
    createCard, getCards, updateCard, deleteCard
} from "../controllers/card.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/:listId")
    .post(createCard)
    .get(getCards)
router.route("/:cardId").patch(updateCard)
router.route("/:cardId").delete(deleteCard)

export default router