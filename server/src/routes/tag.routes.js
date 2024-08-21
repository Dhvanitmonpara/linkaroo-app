import { Router } from "express";
import {
    createTag,
    deleteTag,
    addTag,
    removeTag,
    getTagsByList,
    getTagsByOwner,
    getTagsByCollaborator,
    renameTag,
    customizeListTag
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/").post(createTag)

router.route("/get/list/:listId").get(getTagsByList)
router.route("/get/o").get(getTagsByOwner)
router.route("/get/c").get(getTagsByCollaborator)

router.route("/:listId/add").patch(addTag)
router.route("/:listId/remove").patch(removeTag)
router.route("/:listId/customize").patch(customizeListTag)

router.route("/:tagId")
    .delete(deleteTag)
    .put(renameTag)

export default router