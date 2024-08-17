import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    coverImage: {
        type: String,
        default: ""
    },
    theme: {
        type: String,
        default: "dark"
    },
    font: {
        type: String,
        default: "font-mono"
    },
    bio: {
        type: String,
        trim: true
    },
}, { timestamps: true })

export const Profile = mongoose.model("Profile", profileSchema)