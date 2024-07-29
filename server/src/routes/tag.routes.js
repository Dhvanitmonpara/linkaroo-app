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
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/").post(createTag)

router.route("/:listId").get(getTagsByList)
router.route("/o").get(getTagsByOwner)
router.route("/c").get(getTagsByCollaborator)

router.route("/:listId/add").patch(addTag)
router.route("/:listId/remove").patch(removeTag)

router.route("/:tagId")
    .delete(deleteTag)
    .put(renameTag)

export default router