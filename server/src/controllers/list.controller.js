import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { List } from "../models/list.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import getPublicId from "../utils/getPublicId.js"
import listOwnerVerification from "../utils/listOwnerVerification.js"
import { ObjectId } from "mongodb"
import { Card } from "../models/card.model.js"

const createList = asyncHandler(async (req, res) => {

    const { title, description, theme = "bg-zinc-200", coverImage } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const listOnDatabase = await List.findOne({
        title,
        createdBy: req.user._id
    })

    if (listOnDatabase) {
        throw new ApiError(400, "List with the same title already exists")
    }

    const list = await List.create({
        createdBy: req.user._id,
        title,
        description,
        theme,
        coverImage,
        collaborators: []
    })

    if (!list) {
        throw new ApiError(500, "Failed to create list")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list,
            "List created successfully"
        ))
})

const addCollaborator = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    const { userId } = req.body

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    if (userId == req.user?.id) {
        throw new ApiError(400, "You cannot add yourself as a collaborator")
    }

    if (list.collaborators.includes(userId)) {
        throw new ApiError(400, "User is already a collaborator")
    }

    list.collaborators.push(userId)
    await list.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list,
            "Collaborator added successfully"
        ))
})

const deleteCollaborator = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    const { userId } = req.body

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    const newCollaborators = list.collaborators.filter(collaborator => (
        (typeof collaborator == "object" ? collaborator.valueOf().toString() : collaborator.toString()) !== userId.toString()
    ))
    list.collaborators = newCollaborators
    await list.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list,
            "Collaborator deleted successfully"
        ))
})

const getListById = asyncHandler(async (req, res) => {
    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const listIdObject = new ObjectId(listId);

    const list = await List.aggregate([
        {
            $match: { _id: listIdObject }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
        },
        {
            $unwind: '$createdBy'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'collaborators',
                foreignField: '_id',
                as: 'collaborators'
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                theme: 1,
                font: 1,
                createdAt: 1,
                updatedAt: 1,
                collaborators: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    fullName: 1,
                    avatarImage: 1,
                },
                createdBy: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    fullName: 1,
                    avatarImage: 1,
                },
                tags: 1
            }
        }
    ])

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list[0],
            "List retrieved successfully"
        ))

})

const updateList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId)

    listOwnerVerification(list.createdBy, req.user, res)

    const { title, description, theme = "dark" } = req.body

    if (!title || !description) {
        throw new ApiError(400, "At least one field needs to be updated")
    }

    const updatedList = await List.findByIdAndUpdate(
        listId,
        {
            $set: {
                title,
                description,
                theme,
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedList,
            "List updated successfully"
        ))
})

const deleteList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    const listCards = Card.deleteMany({ listId })

    if (!listCards) {
        throw new ApiError(500, "Failed to delete list cards")
    }

    await list.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list,
            "List deleted successfully"
        ))


})

const getListsByOwner = asyncHandler(async (req, res) => {

    const lists = await List.find({ createdBy: req.user?._id })

    if (!lists) {
        throw new ApiError(404, "No lists found for this user")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            lists,
            "Lists fetched successfully"
        ))
})

const getListsByCollaborator = asyncHandler(async (req, res) => {

    const lists = await List.find({ collaborators: req.user._id })

    if (!lists) {
        throw new ApiError(404, "No lists found for this user")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            lists,
            "Lists fetched successfully"
        ))

})

const getListsByUser = asyncHandler(async (req, res) => {

    const lists = await List.aggregate([
        {
            $match: {
                $or: [
                    { createdBy: req.user?._id },
                    { collaborators: req.user?._id }
                ]
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
        },
        {
            $unwind: '$createdBy'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'collaborators',
                foreignField: '_id',
                as: 'collaborators'
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                theme: 1,
                font: 1,
                createdAt: 1,
                updatedAt: 1,
                coverImage: 1,
                collaborators: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    fullName: 1,
                    avatarImage: 1,
                },
                createdBy: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    fullName: 1,
                    avatarImage: 1,
                },
                tags: 1
            }
        }
    ])

    if (!lists) {
        throw new ApiError(404, "No lists found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            lists,
            "Lists fetched successfully"
        ))
})

const getListsByTagId = asyncHandler(async (req, res) => {

    const tagId = req.params.tagId

    if (!tagId) {
        throw new ApiError(404, "Tag id is required")
    }

    const lists = await List.find({ tags: tagId })

    if (!lists) {
        throw new ApiError(404, "No lists found for this tag")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            lists,
            "Lists fetched successfully"
        ))

})

const uploadCoverImage = asyncHandler(async (req, res) => {
    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    list.coverImage = coverImage.url;
    await list.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                list,
                coverImage: coverImage.url,
            },
            "Cover image uploaded successfully"
        ))
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId);

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    if (!list.coverImage) {
        throw new ApiError(400, "No cover image currently attached to this list")
    }

    const coverImageName = getPublicId(list.coverImage);

    if (!coverImageName) {
        throw new ApiError(500, "Error while extracting image name from image URL")
    }

    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    const cloudinaryRes = await deleteFromCloudinary(coverImageName);

    list.coverImage = coverImage.url;
    await list.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { list, cloudinaryRes },
            "Cover image updated successfully"
        ))
});

const deleteCoverImage = asyncHandler(async (req, res) => {
    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId);

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    listOwnerVerification(list.createdBy, req.user, res)

    if (!list.coverImage) {
        return res.status(400).json(new ApiResponse(400, "No cover image found"))
    }

    const coverImageName = getPublicId(list.coverImage);

    const coverImage = deleteFromCloudinary(coverImageName);

    if (!coverImage) {
        throw new ApiError(500, "Error while deleting cover image from Cloudinary")
    }

    list.coverImage = "";
    await list.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { list, coverImage },
            "Cover image deleted successfully"
        ))

})

const toggleIsPublic = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    list.isPublic = !list.isPublic;
    await list.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            list,
            "List visibility toggled successfully"
        ))

})

export {
    createList,
    getListById,
    getListsByOwner,
    getListsByCollaborator,
    getListsByTagId,
    getListsByUser,
    updateList,
    deleteList,
    addCollaborator,
    deleteCollaborator,
    updateCoverImage,
    uploadCoverImage,
    deleteCoverImage,
    toggleIsPublic
}