import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Card } from "../models/card.model"

const createCard = asyncHandler(async (req, res) => {
    const { title, content, link } = req.body

    if (!title || !link) {
        throw new ApiError(400, "title and link are required")
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const card = await user.createCard({
        title,
        content,
        link,
        userId: user._id
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