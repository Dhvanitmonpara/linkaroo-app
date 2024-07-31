import { Router } from "express";
import {
    createList,
    getListsByOwner,
    getListsByCollaborator,
    getListsByTagId,
    updateList,
    deleteList,
    addCollaborator,
    deleteCollaborator,
    updateCoverImage,
    uploadCoverImage,
    deleteCoverImage
} from "../controllers/list.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/").post(createList)

router.route("/o").get(getListsByOwner)

router.route("/o/:listId")
    .delete(deleteList)
    .patch(updateList)

router.route("/c").get(getListsByCollaborator)

router.route("/o/c/:listId")
    .patch(addCollaborator)
    .delete(deleteCollaborator)

router.route("/t/:tagId").get(getListsByTagId)

router.route("/o/:listId/cover-image")
    .delete(deleteCoverImage)
    .post(upload.single("coverImage"), uploadCoverImage)
    .patch(upload.single("coverImage"), updateCoverImage)

export default router