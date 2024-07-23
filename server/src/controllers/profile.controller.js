import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Card } from "../models/card.model.js"

const updateBio = asyncHandler(async (req, res) => {
    const { bio } = req.body

    if (!bio) {
        throw new ApiError(400, "Bio is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                bio
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Bio updated successfully"
        ))

})

export { updateBio }