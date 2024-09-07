import { Router } from "express";
import {
    createCard, getCardsByList, updateCard, deleteCard,
    toggleIsChecked
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

router.route("/:cardId/toggle-checked").patch(toggleIsChecked)

export default router