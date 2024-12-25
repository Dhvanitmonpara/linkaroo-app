import { Router } from "express";
import {
    createCollection,
    getCollectionById,
    getCollectionsByOwner,
    getCollectionsByCollaborator,
    getCollectionsByTagId,
    updateCollection,
    deleteCollection,
    addCollaborator,
    deleteCollaborator,
    updateCoverImage,
    uploadCoverImage,
    deleteCoverImage,
    toggleIsPublic,
    getCollectionsByUser
} from "../controllers/collection.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/").post(createCollection)

router.route("/u/:listId").get(getCollectionById)

router.route("/o").get(getCollectionsByOwner)

router.route("/o/:listId")
    .delete(deleteCollection)
    .patch(updateCollection)

router.route("/c").get(getCollectionsByCollaborator)

router.route("/u").all(getCollectionsByUser)

router.route("/o/c/:listId")
    .patch(addCollaborator)
    .delete(deleteCollaborator)

router.route("/t/:tagId").get(getCollectionsByTagId)

router.route("/status/:listId").patch(toggleIsPublic)

router.route("/o/:listId/cover-image")
    .delete(deleteCoverImage)
    .post(upload.single("coverImage"), uploadCoverImage)
    .patch(upload.single("coverImage"), updateCoverImage)

export default router