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

const router = Router()

// secure routes
router.route("/:collectionId")
    .post(createLink)
    .get(getLinksByCollection)

router.route("/quick-add/:collectionId").post(createLinkWithMetadata)
router.route("/move-link").patch(moveLinkFromInbox)
router.route("/:linkId").patch(updateLink)
router.route("/:userLinkId").delete(deleteLink)
router.route("/:linkId/toggle-checked").patch(toggleIsChecked)

export default router