import { Router } from "express";
import {
    createTag, 
    deleteTag,
    addTag,
    getTagsByList,
    renameTag,
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/").post(createTag)
router.route("/").get(getTagsByList)
router.route("/:tagId").patch(addTag).delete(deleteTag).put(renameTag)

export default router