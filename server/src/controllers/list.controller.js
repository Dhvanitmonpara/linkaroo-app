import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { List } from "../models/list.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import getPublicId from "../utils/getPublicId.js"

const createList = asyncHandler(async (req, res) => {

    const { title, description, theme = "dark", font = "space-mono" } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const list = await List.create({
        createdBy: req.user._id,
        title,
        description,
        theme,
        font,
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

const areYouOwnerOfThisList = (list, user, res) => {
    if ((typeof list == 'object' ? list.valueOf() : list) !== (typeof user._id == "object" ? user._id.valueOf() : user._id)) {
        return res
            .status(403)
            .json(new ApiResponse(
                403,
                "You are not a owner of this list"
            ))
    }
}

const addCollaborator = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    areYouOwnerOfThisList(list.createdBy, req.user, res)

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

    areYouOwnerOfThisList(list.createdBy, req.user, res)

    const { userId } = req.body

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }
    console.log(list.collaborators)


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

const updateList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const listOnDatabase = await List.findById(listId)

    if (listOnDatabase.createdBy.valueOf() == req.user?._id) {

        const { title, description, theme = "dark", font = "space-mono" } = req.body

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
                    font
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

    } else {
        return res
            .status(403)
            .json(new ApiResponse(
                403,
                "You are not a owner of this list"
            ))
    }

})

const deleteList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const listOnDatabase = await List.findById(listId)

    if (listOnDatabase.createdBy.valueOf() == req.user._id) {

        const deletedList = await List.findByIdAndDelete(listId)

        if (!deletedList) {
            throw new ApiError(404, "List not found")
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                deletedList,
                "List deleted successfully"
            ))

    } else {

        return res
            .status(403)
            .json(new ApiResponse(
                403,
                "You are not a owner of this list"
            ))
    }
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

const uploadCoverImage = asyncHandler(async (req, res) => {
    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const list = await List.findById(listId)

    if (!list) {
        throw new ApiError(404, "List not found")
    }

    if (list.createdBy.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiResponse(
                403,
                "You are not a owner of this list"
            ))
    }

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

    if (list.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, "You are not a owner of this list"))
    }

    if(!list.coverImage) {
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

    if (list.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, "You are not a owner of this list"))
    }

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

export {
    createList,
    getListsByOwner,
    getListsByCollaborator,
    updateList,
    deleteList,
    addCollaborator,
    deleteCollaborator,
    updateCoverImage,
    uploadCoverImage,
    deleteCoverImage
}