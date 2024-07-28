import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Card } from "../models/card.model.js"

const createCard = asyncHandler(async (req, res) => {

    const { listId } = req.params

    if(!listId) {
        throw new ApiError(400, "List ID is required")
    }

    const { title, description, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const card = await Card.create({
        title,
        description: description?description: "",
        link,
        userId: user._id,
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

const getCards = asyncHandler(async (req, res) => {

    const cards = await Card.find({ userId: req.user.id })

    if (!cards) {
        throw new ApiError(404, "No cards found for this user")
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

    const { title, content, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    let card;
    if (content) {
        card = await Card.findByIdAndUpdate(
            req.params.cardId,
            { title, content, link },
            { new: true }
        )
    } else {
        card = await Card.findByIdAndUpdate(
            req.params.cardId,
            { title, link },
            { new: true }
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            card,
            "Card updated successfully"
        ))
})

const deleteCard = asyncHandler(async (req, res) => {

    const { cardId } = await Card.findByIdAndDelete(req.params.cardId)

    if (!cardId) {
        throw new ApiError(400, "Card ID is required")
    }

    const card = await Card.findByIdAndDelete(cardId)

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            card,
            "Card deleted successfully"
        ))
})

export { createCard, getCards, updateCard, deleteCard }