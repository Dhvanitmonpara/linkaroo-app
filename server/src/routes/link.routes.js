import { Router } from "express";
import {
    createCard,
    getCardsByList,
    updateCard,
    deleteCard,
    toggleIsChecked,
    moveCardFromInbox,
    createCardWithMetadata
} from "../controllers/card.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/:listId")
    .post(createCard)
    .get(getCardsByList)

router.route("/quick-add/:listId").post(createCardWithMetadata)

router.route("/move-card").patch(moveCardFromInbox)

router.route("/:cardId")
    .patch(updateCard)
    .delete(deleteCard)

router.route("/:cardId/toggle-checked").patch(toggleIsChecked)

export default router