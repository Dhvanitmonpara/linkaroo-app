import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    link: {
        type: String,
        required: true,
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