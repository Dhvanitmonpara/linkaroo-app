import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Collection } from "../models/collection.model.js"
import { Link } from "../models/link.model.js"
import fetchMetadata from "../utils/fetchMetadata.js"

const createLink = asyncHandler(async (req, res) => {

    const { collectionId } = req.params

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const { title, description, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    const links = await Link.find({ userId: req.user.id, collectionId })

    if (links.some(link => link.title == title)) {
        throw new ApiError(400, "Link with the same title already exists")
    }

    const response = await Link.create({
        title,
        description: description || "",
        link,
        userId: req.user?._id,
        collectionId
    })

    if (!response) {
        throw new ApiError(500, "Failed to create link")
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            link = response,
            "Link created successfully"
        ))

})

const createLinkWithMetadata = asyncHandler(async (req, res) => {

    const { collectionId } = req.params

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const { link } = req.body

    const data = await fetchMetadata(link);

    if (!data.title || !data.description) {
        throw new ApiError(500, "Something went wrong while fetching meta-data")
    }

    const title = data.title
    const description = data.description

    const links = await Link.find({ userId: req.user.id, collectionId })

    if (links.some(link => link.title == title)) {
        throw new ApiError(400, "Link with the same title already exists")
    }

    const response = await Link.create({
        title,
        description: description ? description : "",
        link,
        userId: req.user?._id,
        listId: listId
    })

    if (!response) {
        throw new ApiError(500, "Failed to create link")
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            link = response,
            "Link created successfully"
        ))

})

const getLinksByCollection = asyncHandler(async (req, res) => {

    const collectionId = req.params.collectionId

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const links = await Link.find({ collectionId })

    if (!links) {
        throw new ApiError(404, "Link not found for the given collection")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            links,
            "Links retrieved successfully"
        ))
})

const updateLink = asyncHandler(async (req, res) => {

    const linkId = req.params.linkId

    if (!linkId) {
        throw new ApiError(400, "Link ID is required")
    }

    const { title, description, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    const response = await Link.findByIdAndUpdate(
        linkId,
        {
            title,
            description,
            link
        },
        { new: true }
    )


    return res
        .status(200)
        .json(new ApiResponse(
            200,
            link = response,
            "Link updated successfully"
        ))
})

const deleteLink = asyncHandler(async (req, res) => {

    const linkId = req.params.linkId

    if (!linkId) {
        throw new ApiError(400, "Link ID is required")
    }

    const link = await Link.findByIdAndDelete(linkId)

    if (!link) {
        throw new ApiError(400, "Error deleting Link")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Link deleted successfully"
        ))
})

const toggleIsChecked = asyncHandler(async (req, res) => {

    const linkId = req.params.linkId

    if (!linkId) {
        throw new ApiError(400, "Link ID is required")
    }

    const link = await Link.findById(linkId)

    if (!link) {
        throw new ApiError(400, "Link not found")
    }

    link.isChecked = !link.isChecked

    await link.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Link updated successfully"
        ))
})

const moveLinkFromInbox = asyncHandler(async (req, res) => {

    const { collectionId, linkId } = req.body

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required")
    }

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new ApiError(404, "Collection not found")
    }

    const Link = await Link.findByIdAndUpdate(
        linkId,
        {
            $set: {
                collectionId
            }
        },
        { new: true }
    )

    if (!Link) {
        throw new ApiError(404, "Link not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Link moved successfully"
        ))
})

export { createLink, createLinkWithMetadata, getLinksByCollection, updateLink, deleteLink, toggleIsChecked, moveLinkFromInbox }