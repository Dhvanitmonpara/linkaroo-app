import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Collection } from "../models/collection.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import getPublicId from "../utils/getPublicId.js"
import collectionOwnerVerification from "../utils/collectionOwnerVerification.js"
import { ObjectId } from "mongodb"
import { Link } from "../models/link.model.js"

const createCollection = asyncHandler(async (req, res) => {

    const { title, description, theme = "bg-zinc-200", coverImage, isInbox = false } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const collectionOnDatabase = await Collection.findOne({
        title,
        createdBy: req.user._id
    })

    if (collectionOnDatabase) {
        throw new ApiError(400, "Collection with the same title already exists")
    }

    const collection = await Collection.create({
        createdBy: req.user._id,
        title,
        description,
        isInbox,
        theme,
        coverImage,
        collaborators: []
    })

    if (!collection) {
        throw new ApiError(500, "Failed to create collection")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collection,
            "Collection created successfully"
        ))
})

const addCollaborator = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collectionOwnerVerification(collection.createdBy, req.user, res)

    const { userId } = req.body

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    if (userId == req.user?.id) {
        throw new ApiError(400, "You cannot add yourself as a collaborator")
    }

    if (collection.collaborators.includes(userId)) {
        throw new ApiError(400, "User is already a collaborator")
    }

    collection.collaborators.push(userId)
    await collection.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collection,
            "Collaborator added successfully"
        ))
})

const deleteCollaborator = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collectionOwnerVerification(collection.createdBy, req.user, res)

    const { userId } = req.body

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    const newCollaborators = collection.collaborators.filter(collaborator => (
        (typeof collaborator == "object" ? collaborator.valueOf().toString() : collaborator.toString()) !== userId.toString()
    ))
    collection.collaborators = newCollaborators
    await collection.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collection,
            "Collaborator deleted successfully"
        ))
})

const getCollectionById = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collectionIdObject = new ObjectId(collectionId);

    const collection = await Collection.aggregate([
        {
            $match: { _id: collectionIdObject }
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
                isInbox: 1,
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

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collection[0],
            "Collection retrieved successfully"
        ))

})

const updateCollection = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(collectionId)

    collectionOwnerVerification(collection.createdBy, req.user, res)

    const { title, description, theme = "dark" } = req.body

    if (!title || !description) {
        throw new ApiError(400, "At least one field needs to be updated")
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
        CollectionId,
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
            updatedCollection,
            "Collection updated successfully"
        ))
})

const deleteCollection = asyncHandler(async (req, res) => {

    const collectionId = req.params.CollectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collectionOwnerVerification(collection.createdBy, req.user, res)

    const collectionLinks = Link.deleteMany({ collectionId })

    if (!collectionLinks) {
        throw new ApiError(500, "Failed to delete Collection links")
    }

    await Collection.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Collection deleted successfully"
        ))


})

const getCollectionsByOwner = asyncHandler(async (req, res) => {

    const collections = await Collection.find({ createdBy: req.user?._id })

    if (!collections) {
        throw new ApiError(404, "No collections found for this user")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collections,
            "Collections fetched successfully"
        ))
})

const getCollectionsByCollaborator = asyncHandler(async (req, res) => {

    const collections = await Collection.find({ collaborators: req.user._id })

    if (!collections) {
        throw new ApiError(404, "No collections found for this user")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collections,
            "Collections fetched successfully"
        ))

})

const getCollectionsByUser = asyncHandler(async (req, res) => {

    const collections = await Collection.aggregate([
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
                isInbox: 1,
                coverImage: 1,
                isPublic: 1,
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

    if (!collections) {
        throw new ApiError(404, "No collections found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collections,
            "Collections fetched successfully"
        ))
})

const getCollectionsByTagId = asyncHandler(async (req, res) => {

    const tagId = req.params.tagId

    if (!tagId) {
        throw new ApiError(404, "Tag id is required")
    }

    const collections = await Collection.find({ tags: tagId })

    if (!collections) {
        throw new ApiError(404, "No collections found for this tag")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collections,
            "Collections fetched successfully"
        ))

})

const uploadCoverImage = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(CollectionId)

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collectionOwnerVerification(collection.createdBy, req.user, res)

    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    collection.coverImage = coverImage.url;
    await collection.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                collectionId: collection._id,
                coverImage: coverImage.url,
            },
            "Cover image uploaded successfully"
        ))
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(CollectionId);

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collectionOwnerVerification(collection.createdBy, req.user, res)

    if (!collection.coverImage) {
        throw new ApiError(400, "No cover image currently attached to this Collection")
    }

    const coverImageName = getPublicId(collection.coverImage);

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

    collection.coverImage = coverImage.url;
    await collection.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { collection, cloudinaryRes },
            "Cover image updated successfully"
        ))
});

const deleteCoverImage = asyncHandler(async (req, res) => {
    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(collectionId);

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collectionOwnerVerification(collection.createdBy, req.user, res)

    if (!collection.coverImage) {
        return res.status(400).json(new ApiResponse(400, "No cover image found"))
    }

    const coverImageName = getPublicId(collection.coverImage);

    const coverImage = deleteFromCloudinary(coverImageName);

    if (!coverImage) {
        throw new ApiError(500, "Error while deleting cover image from Cloudinary")
    }

    collection.coverImage = "";
    await collection.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { collection, coverImage },
            "Cover image deleted successfully"
        ))

})

const toggleIsPublic = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    collection.isPublic = !collection.isPublic;
    await collection.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            collection,
            "Collection visibility toggled successfully"
        ))

})

export {
    createCollection,
    getCollectionById,
    getCollectionsByOwner,
    getCollectionsByCollaborator,
    getCollectionsByTagId,
    getCollectionsByUser,
    updateCollection,
    deleteCollection,
    addCollaborator,
    deleteCollaborator,
    updateCoverImage,
    uploadCoverImage,
    deleteCoverImage,
    toggleIsPublic
}