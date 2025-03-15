import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema({

    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: null
    },
    link: {
        type: String,
        required: true,
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: "Collection",
        required: true
    },
    
}, { timestamps: true })

export const Link = mongoose.model("Link", linkSchema)