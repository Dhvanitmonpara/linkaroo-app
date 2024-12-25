import { Router } from "express";
import {
    createLink,
    getLinksByCollection,
    updateLink,
    deleteLink,
    toggleIsChecked,
    moveLinkFromInbox,
    createLinkWithMetadata
} from "../controllers/link.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/:collectionId")
    .post(createLink)
    .get(getLinksByCollection)

router.route("/quick-add/:collectionId").post(createLinkWithMetadata)

router.route("/move-card").patch(moveLinkFromInbox)

router.route("/:cardId")
    .patch(updateLink)
    .delete(deleteLink)

router.route("/:linkId/toggle-checked").patch(toggleIsChecked)

export default router