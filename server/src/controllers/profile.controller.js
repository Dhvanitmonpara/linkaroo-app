import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Profile } from "../models/profile.model.js"
import { uploadOnCloudinary, deleteFromCloudinary, getPublicId } from "../utils/cloudinary.js"

const updateBio = asyncHandler(async (req, res) => {
    const { bio } = req.body

    if (!bio) {
        throw new ApiError(400, "Bio is required")
    }

    const profile = await Profile.findByIdAndUpdate(
        { userId: req.user?._id },
        {
            $set: {
                bio
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            profile,
            "Bio updated successfully"
        ))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    // deleting cover image from cloudinary

    const oldImagePath = Profile.findOne({ userId: req.user?._id }).select("coverImage")

    const coverImageName = getPublicId(oldImagePath)

    if (!coverImageName) {
        throw new ApiError(500, "Error while extracting image name from image URL",)
    }

    const response = await deleteFromCloudinary(coverImageName)

    // updating profile in the database

    const profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-bio")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                profile,
                deletionResponse: response
            },
            "Cover image updated successfully"
        ))
})

const uploadUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    const coverImageURL = coverImage?.url

    const profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
            $set: {
                coverImage: coverImageURL
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                profile,
                coverImageURL
            },
            "Cover image uploaded successfully"
        ))
})

const toggleTheme = asyncHandler(async (req, res) => {

    const { theme } = req.body

    const profile = await Profile.findByIdAndUpdate(
        { userId: req.user?._id },
        {
            $set: {
                theme: theme
            }
        },
        {
            new: true
        }
    ).select("-coverImage -bio")

    setCookie("theme", profile.theme)

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            profile,
            "Theme updated successfully"
        ))

})

export {
    updateBio,
    updateUserCoverImage,
    uploadUserCoverImage,
    toggleTheme
}