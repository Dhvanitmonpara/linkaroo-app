import mongoose, { Schema } from "mongoose";

const listSchema = new Schema({

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    coverImage: {
        type: String,
        default: ""
    },
    theme: {
        type: String,
        default: "bg-zinc-200"
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isInbox: {
        type: Boolean,
        default: false
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag"
        }
    ],
    collaborators: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true })

export const List = mongoose.model("List", listSchema)