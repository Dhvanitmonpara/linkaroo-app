import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Card } from "../models/card.model.js"
import fetchMetadata from "../utils/fetchMetadata.js"

const createCard = asyncHandler(async (req, res) => {

    const { listId } = req.params

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const { title, description, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    const cards = await Card.find({ userId: req.user.id, listId: listId })

    if (cards.some(card => card.title == title)) {
        throw new ApiError(400, "Card with the same title already exists")
    }

    const card = await Card.create({
        title,
        description: description ? description : "",
        link,
        userId: req.user?._id,
        listId: listId
    })

    if (!card) {
        throw new ApiError(500, "Failed to create card")
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            card,
            "Card created successfully"
        ))

})

const createCardWithMetadata = asyncHandler(async (req, res) => {

    const { listId } = req.params

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const { link } = req.body

    const data = await fetchMetadata(link);

    if (!data.title || !data.description) {
        throw new ApiError(500, "Something went wrong while fetching meta-data")
    }

    const title = data.title
    const description = data.description

    const cards = await Card.find({ userId: req.user.id, listId: listId })

    if (cards.some(card => card.title == title)) {
        throw new ApiError(400, "Card with the same title already exists")
    }

    const card = await Card.create({
        title,
        description: description ? description : "",
        link,
        userId: req.user?._id,
        listId: listId
    })

    if (!card) {
        throw new ApiError(500, "Failed to create card")
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            card,
            "Card created successfully"
        ))

})

const getCardsByList = asyncHandler(async (req, res) => {

    const listId = req.params.listId

    if (!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const cards = await Card.find({ listId })

    if (!cards) {
        throw new ApiError(404, "Card not found for the given list")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            cards,
            "Cards retrieved successfully"
        ))
})

const updateCard = asyncHandler(async (req, res) => {

    const cardId = req.params.cardId

    if (!cardId) {
        throw new ApiError(400, "Card ID is required")
    }

    const { title, description, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    const card = await Card.findByIdAndUpdate(
        cardId,
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
            card,
            "Card updated successfully"
        ))
})

const deleteCard = asyncHandler(async (req, res) => {

    const cardId = req.params.cardId

    if (!cardId) {
        throw new ApiError(400, "Card ID is required")
    }

    const card = await Card.findByIdAndDelete(cardId)

    if (!card) {
        throw new ApiError(400, "Error deleting Card")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            card,
            "Card deleted successfully"
        ))
})

const toggleIsChecked = asyncHandler(async (req, res) => {

    const cardId = req.params.cardId

    if (!cardId) {
        throw new ApiError(400, "Card ID is required")
    }

    const card = await Card.findById(cardId)

    if (!card) {
        throw new ApiError(400, "Card not found")
    }

    card.isChecked = !card.isChecked

    await card.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            card,
            "Card updated successfully"
        ))
})

export { createCard, createCardWithMetadata, getCardsByList, updateCard, deleteCard, toggleIsChecked }