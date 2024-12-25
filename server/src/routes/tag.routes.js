import { Router } from "express";
import {
    createTag,
    deleteTag,
    addTag,
    removeTag,
    getTagsByCollection,
    getTagsByOwner,
    getTagsByCollaborator,
    renameTag,
    customizeCollectionTag
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/").post(createTag)

router.route("/get/list/:listId").get(getTagsByCollection)
router.route("/get/o").get(getTagsByOwner)
router.route("/get/c").get(getTagsByCollaborator)

router.route("/:listId/add").patch(addTag)
router.route("/:listId/remove").patch(removeTag)
router.route("/:listId/customize").patch(customizeCollectionTag)

router.route("/:tagId")
    .delete(deleteTag)
    .put(renameTag)

export default router