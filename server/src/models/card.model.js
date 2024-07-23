import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

export const Card = mongoose.model("Card", cardSchema)