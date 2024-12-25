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

router.route("/u/:collectionId").get(getCollectionById)

router.route("/o").get(getCollectionsByOwner)

router.route("/o/:collectionId")
    .delete(deleteCollection)
    .patch(updateCollection)

router.route("/c").get(getCollectionsByCollaborator)

router.route("/u").all(getCollectionsByUser)

router.route("/o/c/:collectionId")
    .patch(addCollaborator)
    .delete(deleteCollaborator)

router.route("/t/:tagId").get(getCollectionsByTagId)

router.route("/status/:collectionId").patch(toggleIsPublic)

router.route("/o/:collectionId/cover-image")
    .delete(deleteCoverImage)
    .post(upload.single("coverImage"), uploadCoverImage)
    .patch(upload.single("coverImage"), updateCoverImage)

export default router