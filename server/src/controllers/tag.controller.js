import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tag } from "../models/tag.model.js"
import { List } from "../models/list.model.js"
import listOwnerVerification from "../utils/listOwnerVerification.js"

const addUsernameInTag = (tag, username) => {
    const addedUserTag = username + "/" + tag
    return addedUserTag
}

const removeUsernameTag = (tag, username) => {
    const removedUserTag = tag.replace(username + "/", "")
    return removedUserTag
}

const createTag = asyncHandler(async (req, res) => {

    const { tag } = req.body

    if (!tag) {
        throw new ApiError(400, "tag is required")
    }

    const userTag = addUsernameInTag(tag, req.user.username)

    const existingTag = await Tag.findOne({ tagname: userTag })

    if (existingTag) {
        throw new ApiError(400, "Tag already exists")
    }

    const newTag = await Tag.create({ tagname: userTag, owner: req.user._id })

    const removedUserTag = removeUsernameTag(newTag.tagname, req.user.username)

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            { tagname: removedUserTag },
            "Tag created successfully"
        ))
})

const removeTag = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    const { tag } = req.body

    if (!tag) {
        throw new ApiError(400, "Tag is required")
    }

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    const userTag = addUsernameInTag(tag, req.user.username)

    const existingTag = await Tag.findOne({ tagname: userTag })

    if (!existingTag) {
        throw new ApiError(404, "Tag not found")
    }

    const tagId = existingTag._id

    if (!tagId) {
        throw new ApiError(400, "Tag ID is required")
    }

    list.tags = list.tags.filter(t => t.toString() !== tagId.toString())
    await list.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list,
            "Tag deleted successfully"
        ))

})

const deleteTag = asyncHandler(async (req, res) => {

    const { tagId } = req.params

    if (!tagId) {
        throw new ApiError(400, "Tag ID is required")
    }

    const tagOnLists = await List.updateMany(
        { tags: tagId },
        { $pull: { tags: tagId } }
    );

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

    const listId = req.params.listId

    const listOnDatabase = await List.findById(listId)

    if (!listOnDatabase) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(listOnDatabase.createdBy, req.user, res)

    const { tag } = req.body

    if (!tag) {
        throw new ApiError(400, "Tag is required")
    }

    const userTag = addUsernameInTag(tag, req.user.username)

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

})

const getTagsByList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
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

    const tags = tagsWithUsername.map((tag) => removeUsernameTag(tag.tagname, req.user.username))

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            tags,
            "Tags retrieved successfully"
        ))

})

const getTagsByOwner = asyncHandler(async (req, res) => {

    const userId = req.user?._id
    const tags = await Tag.find({ owner: userId })

    if (!tags) {
        throw new ApiError(404, "No tags found for this user")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            tags,
            "Tags retrieved successfully"
        ))
})

const getTagsByCollaborator = asyncHandler(async (req, res) => {

    const lists = await List.find({collaborators: req.user?._id})
    console.log(lists)

    if (!lists || lists.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                lists,
                "No tags found for this user"
            ))
    }

    const tagArray = lists.map((tag) => removeUsernameTag(tag.tags.tagname, req.user.username))

    console.log(tagArray)

    if (!tagArray) {
        throw new ApiError(500, "Error while remove username in tags")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            tagArray,
            "Tags retrieved successfully"
        ))

})

const renameTag = asyncHandler(async (req, res) => {

    const tagId = req.params.tagId
    const newTagname = req.body.newTagname

    if (!tagId || !newTagname) {
        throw new ApiError(400, "Tag ID and new tagname are required")
    }

    const userTag = addUsernameInTag(newTagname, req.user.username)

    const newTag = await Tag.findByIdAndUpdate(
        tagId,
        { tagname: userTag },
        { new: true }
    )

    if (!newTag) {
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
    removeTag,
    getTagsByList,
    getTagsByOwner,
    getTagsByCollaborator,
    renameTag,
}