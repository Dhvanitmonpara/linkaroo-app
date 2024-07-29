import { Router } from "express";
import {
    createCard, getCardsByList, updateCard, deleteCard
} from "../controllers/card.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/:listId")
    .post(createCard)
    .get(getCardsByList)
    
router.route("/:cardId")
    .patch(updateCard)
    .delete(deleteCard)

export default router