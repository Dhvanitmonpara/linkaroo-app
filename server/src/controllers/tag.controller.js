import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tag } from "../models/tag.model.js"
import { List } from "../models/list.model.js"

const addUsernameInTag = (tag) => {
    const addedUserTag = req.user.username + " " + tag
    return addedUserTag
}

const removeUsernameTag = (tag) => {
    const removedUserTag = tag.replace(req.user.username + " ", "")
    return removedUserTag
}

const createTag = asyncHandler(async (req, res) => {

    const { tag } = req.body

    if (!tag) {
        throw new ApiError(400, "tag is required")
    }

    const userTag = addUsernameInTag(tag)

    const existingTag = await Tag.findOne({ tagname: userTag })

    if (existingTag) {
        throw new ApiError(400, "Tag already exists")
    }

    const newTag = await Tag.create({ tagname: userTag, owner: req.user._id })

    const removedUserTag = removeUsernameTag(newTag.tagname)

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            { tagname: removedUserTag },
            "Tag created successfully"
        ))
})

const deleteTag = asyncHandler(async (req, res) => {

    const { tagId } = req.body

    if (!tagId) {
        throw new ApiError(400, "Tag ID is required")
    }

    const tagOnLists = await List.aggregate([
        {
            $match: {
                tags: tagId
            }
        },
        {
            $set: {
                tags: { $pull: { $in: [tagId] } }
            }
        }
    ])

    if (tagOnLists.length > 0) {
        throw new ApiError(400, "Tag is used on a list")
    }

    const tag = await Tag.findByIdAndDelete(tagId)

    if (!tag) {
        throw new ApiError(404, "Tag not found")
    }

    const removedUserTag = removeUsernameTag(tag.tagname)

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                tagname: removedUserTag,
                tagOnLists
            },
            "Tag deleted successfully"
        ))

})

const addTag = asyncHandler(async (req, res) => {

    const { listId } = req.params.listId

    const listOnDatabase = await List.findById(listId)

    if (!listOnDatabase) {
        throw new ApiError(404, "List not found")
    }

    if (listOnDatabase.createdBy == req.user._id) {

        const { tag } = req.body

        if (!tag) {
            throw new ApiError(400, "Tag is required")
        }

        const userTag = addUsernameInTag(tag)

        const existingTag = await Tag.findOne({ tagname: userTag })

        if (!existingTag) {
            throw new ApiError(400, "Tag not found")
        }

        const tagAlreadyExists = listOnDatabase.tags.includes(existingTag._id)

        if (tagAlreadyExists) {
            throw new ApiError(400, "Tag already exists")
        }

        listOnDatabase.tags.push(existingTag._id)
        await listOnDatabase.save()

        return res
           .status(200)
           .json(new ApiResponse(
                200,
                listOnDatabase,
                "Tag added successfully"
            ))

    } else {
        return res
            .status(403)
            .json(new ApiResponse(403, "You are not a owner of this list"))
    }

})

const getTagsByList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if(!listId){
        throw new ApiError(400, "List ID is required")
    }

    const tagIds = await List.findById(listId).select("tags")

    if (!tagIds) {
        throw new ApiError(404, "List not found")
    }

    const tagsWithUsername = await Tag.find({ _id: { $in: tagIds.tags } })

    if (!tagsWithUsername) {
        throw new ApiError(404, "Tags not found")
    }

    const tags = tagsWithUsername.map((tag) => removeUsernameTag(tag.tagname))

    return res
     .status(200)
     .json(new ApiResponse(
            200,
            tags,
            "Tags retrieved successfully"
        ))

})

const renameTag = asyncHandler(async (req, res) => {

    const {tagId, newTagname} = req.body

    if (!tagId || !newTagname) {
        throw new ApiError(400, "Tag ID and new tagname are required")
    }

    const newTag = await Tag.findByIdAndUpdate(
        tagId, 
        { tagname: newTagname }, 
        { new: true}
    )

    if(!newTag) {
        throw new ApiError(404, "Tag not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            newTag,
            "Tag renamed successfully"
        ))

})

export {
    createTag,
    deleteTag,
    addTag,
    getTagsByList,
    renameTag,
}