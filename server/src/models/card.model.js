import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    link: {
        type: String,
        required: true,
    },
    theme: {
        type: String,
        default: "bg-zinc-200"
    },
    font: {
        type: String,
        default: "font-mono"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    
}, { timestamps: true })

export const Card = mongoose.model("Card", cardSchema)