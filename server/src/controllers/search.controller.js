import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { List } from "../models/list.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import getPublicId from "../utils/getPublicId.js"
import listOwnerVerification from "../utils/listOwnerVerification.js"

const searchPublicCards = asyncHandler(async (res, req) => {

    const cardTitle = res.query.cardTitle

    if(!cardTitle) {
        throw new ApiError(400, "Card title is required")
    }

    const cards = await List.find({
        
    })

})

export { searchPublicCards }