import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import getPublicId from "../utils/getPublicId.js"
import sendMail from "../utils/sendMail.js"
import { Collection } from "../models/collection.model.js"

const refreshTokenMaxAge = 3600 * 24 * 10 * 1000;
const accessTokenMaxAge = 3600 * 24 * 1000;

const options = {
    maxAge: accessTokenMaxAge,
    httpOnly: true,
    secure: process.env.HTTP_SECURE_OPTION,
    sameSite: "None",
    path: "/",
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get data from frontend
    // validation - not empty
    // check if user already exists: username, email
    // remove password and refresh token field from response
    // check for user creation
    // return response

    // you can receive data using req.body given in json or form from frontend
    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some(field => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.file?.path;

    let avatar = null;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath)
    } else {
        avatar = { url: "https://res.cloudinary.com/df5xtraqr/image/upload/v1725599756/otkudqvvu9p99fmixl9k.jpg" }
    }

    const response = await User.create({
        fullName,
        email,
        password,
        avatarImage: avatar.url,
        bio: "",
        coverImage: "",
        theme: "dark",
        username: username.toLowerCase()
    })

    if (!response) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    const inbox = await Collection.create({
        createdBy: response._doc._id,
        title: username + "/inbox",
        isInbox: true,
    })

    if (!inbox) {
        throw new ApiError(500, "Something went wrong while creating inbox")
    }

    const user = { ...response._doc, password: "", refreshToken: "" }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(response._id)

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, { ...options, maxAge: refreshTokenMaxAge })
        .json(
            new ApiResponse(
                201,
                { user, inbox },
                "User registered successfully"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    // receive data from frontend
    // check if data is empty
    // data fetching and validation with db
    // /password checking
    // access and refresh token
    // send cookie
    // send response

    const { username, email, password, rememberMe } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or Email is required")
    }

    if (password === "") {
        throw new ApiError(400, "Password is required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!existingUser) {
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = await existingUser.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id)

    const user = { ...existingUser._doc, refreshToken: "", password: "" }

    if (rememberMe) {
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, { ...options, maxAge: refreshTokenMaxAge })
            .json(
                new ApiResponse(
                    200,
                    user,
                    "User logged In Successfully")
            )
    } else {
        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...options, maxAge: 3600 * 1000 })
            .json(
                new ApiResponse(
                    200,
                    user,
                    "User logged In Successfully"
                )
            )
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", { ...options, maxAge: refreshTokenMaxAge })
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        console.log("user.refreshToken: ", user.refreshToken + "\n")
        console.log("incomingRefreshToken: ", incomingRefreshToken + "\n")

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, { ...options, maxAge: refreshTokenMaxAge })
            .json(new ApiResponse(
                200,
                {},
                "Access Token refreshed"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: true })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password changed successfully"
        ))
})

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        return res
            .status(200)
            .json(
                200,
                user,
                "Unauthorized request"
            )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Current user fetched successfully"
        ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
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
            "Account details updated successfully"
        ))
})

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    // deleting avatar from cloudinary

    const avatarName = getPublicId(req.user.avatarImage)

    if (!avatarName) {
        throw new ApiError(500, "Error while extracting image name from avatar URL",)
    }

    const response = await deleteFromCloudinary(avatarName)

    // updating user in the database

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatarImage: avatar.url } },
        { new: true, select: "-password -refreshToken" }
    );

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                user,
                deletionResponse: response
            },
            "Avatar updated successfully"
        ))
})

const searchUserByEmail = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // FIXME: Add fuzzy search
    // const users = await User.aggregate([
    //     {
    //         $search: {
    //             index: 'username_text_email_text', // Replace with your actual search index name
    //             text: {
    //                 query: `"${user}"`,
    //                 path: ['username', 'email'],
    //                 fuzzy: { maxEdits: 1 } // Adjust maxEdits as needed
    //             }
    //         }
    //     },
    //     {
    //         $project: { _id: 0, username: 1, email: 1 }
    //     }
    // ]);

    // const users = await User.aggregate([
    //     {
    //       $match: {
    //         $text: { $search: user }
    //       }
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         username: 1,
    //         email: 1,
    //         score: { $meta: "textScore" }
    //       }
    //     },
    //     {
    //       $sort: { score: -1 }
    //     },
    //     {
    //       $limit: 10
    //     }
    //   ]);

    // const listIndexes = await User.collection.listIndexes().toArray();
    // console.log("Search Indexes:", listIndexes);

    const users = await User.find({
        email: { $regex: user, $options: 'i' }
    }, { _id: 0, username: 1, email: 1 });

    if (!users) {
        throw new ApiError(404, "No users found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        ));
});

const searchUserByUsername = asyncHandler(async (req, res) => {
    const { user } = req.body;
    const users = await User.find({
        $or: [
            { username: { $regex: user, $options: 'i' } },
            { email: { $regex: user, $options: 'i' } }
        ]
    }, { _id: 0, username: 1, email: 1 })

    if (!users) {
        throw new ApiError(404, "No users found")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        ));
})

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const mailResponse = await sendMail(email, "OTP");

        if (!mailResponse.success) {
            console.error("Failed to send OTP:", mailResponse.error);
            return res.status(500).json({ message: mailResponse.error || "Failed to send OTP" });
        }

        return res.status(200).json({
            messageId: mailResponse.messageId,
            otp: mailResponse.otpCode,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("Error in sendOtp:", error.message);
        return res.status(500).json({
            message: "Failed to send OTP due to server error",
            error: error.message
        });
    }
});

const updateBio = asyncHandler(async (req, res) => {

    const bio = req.body.bio

    if (!bio) {
        throw new ApiError(400, "Bio is required")
    }

    const userId = req.user?._id

    const user = await User.findByIdAndUpdate(
        userId,
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
            user,
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

    const oldImagePath = await User.findById(req.user?._id).$project({ coverImage: 1 })

    const coverImageName = getPublicId(oldImagePath.coverImage)

    if (!coverImageName) {
        throw new ApiError(500, "Error while extracting image name from image URL",)
    }

    const response = await deleteFromCloudinary(coverImageName)

    // updating profile in the database

    const user = await User.findByIdAndUpdate(
        req.user._id,
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
                user,
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

    const user = await User.findByIdAndUpdate(
        req.user._id,
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
                user,
                coverImageURL
            },
            "Cover image uploaded successfully"
        ))
})

const toggleTheme = asyncHandler(async (req, res) => {

    const { theme } = req.body

    const userId = req.user?._id

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                theme: theme
            }
        },
        {
            new: true
        }
    ).select("-coverImage -bio")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Theme updated successfully"
        ))

})

const updateProfileSettings = asyncHandler(async (req, res) => {

    const { font = "font-mono", theme = "dark", isSearchShortcutEnabled } = req.body;
    const userId = req.user?._id;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                font,
                theme,
                isSearchShortcutEnabled
            }
        },
        {
            new: true,
            select: "-refreshToken -password -coverImage -bio" // You can use this option to exclude directly in the query
        }
    );

    if (!user) {
        throw new ApiError(500, "Failed to update profile settings");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile settings updated successfully"
        )
    );
});

const passwordRecovery = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    user.password = password
    const updatedUser = await user.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedUser,
            "Password recovered successfully"
        ))

})

const sendFeedback = asyncHandler(async (req, res) => {
    
    const { title, description } = req.body
    const sendBy = req.user.email

    if(!title || !description) {
        throw new ApiError(400, "title and description are required")
    }

    if (!sendBy) {
        throw new ApiError(400, "Email is required")
    }

    try {
        const mailResponse = await sendMail(process.env.GMAIL_USER, "FEEDBACK-SENT", {
            title,
            description,
            sendBy
        });

        if (!mailResponse.success) {
            console.error("Failed to send Feedback:", mailResponse.error);
            return res.status(500).json({ message: mailResponse.error || "Failed to send Feedback" });
        }

        sendMail(sendBy, "FEEDBACK-RECEIVED");

        return res.status(200).json({
            success: true,
            messageId: mailResponse.messageId,
            message: "Feedback sent successfully"
        });
    } catch (error) {
        console.error("Error in sendFeedback:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send feedback due to server error",
            error: error.message
        });
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    searchUserByEmail,
    searchUserByUsername,
    updateBio,
    updateUserCoverImage,
    uploadUserCoverImage,
    toggleTheme,
    passwordRecovery,
    updateProfileSettings,
    sendOtp,
    sendFeedback
}